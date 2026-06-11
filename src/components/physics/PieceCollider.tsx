import type { PlacedPiece } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';
import { getBoostImpulse } from '@/utils/physics';
import {
  getBumperPadColliders,
  getGoalBucketColliders,
  getHalfPipeColliders,
  getLaunchpadColliders,
  getSpeedBoosterColliders,
  getStraightRampColliders,
} from '@/utils/pieceColliders';
import type { ColliderDescriptor } from '@/utils/pieceColliders';
import { CuboidCollider } from '@react-three/rapier';

/** Maps piece type to its collider descriptor generator with correct args. */
function getCollidersForPiece(
  type: PlacedPiece['type'],
  rotationIndex: number,
): ColliderDescriptor[] {
  switch (type) {
    case 'straight_ramp':
      return getStraightRampColliders(rotationIndex);
    case 'bumper_pad':
      return getBumperPadColliders(false); // placed pieces are never staticTerrain
    case 'speed_booster':
      return getSpeedBoosterColliders(rotationIndex);
    case 'half_pipe':
      return getHalfPipeColliders();
    case 'goal_bucket':
      return getGoalBucketColliders();
    default:
      return [];
  }
}

/**
 * Renders the appropriate Rapier collider(s) for a single placed piece.
 * Each piece type maps to one or more collider descriptors.
 */
function PieceColliderInner({ piece }: { piece: PlacedPiece }) {
  const setMarbleInBucket = useGameStore((s) => s.setMarbleInBucket);
  const rotationY = (Math.PI / 2) * piece.rotationIndex;
  const descriptors = getCollidersForPiece(piece.type, piece.rotationIndex);

  return (
    <group position={piece.position} rotation={[0, rotationY, 0]}>
      {descriptors.map((desc, i) => (
        <CuboidCollider
          // eslint-disable-next-line react/no-array-index-key
          key={`${piece.id}-c${i}`}
          args={desc.halfExtents}
          position={desc.position}
          rotation={desc.rotation}
          sensor={desc.sensor}
          restitution={desc.restitution}
          onIntersectionEnter={(payload) => {
            if (piece.type === 'speed_booster') {
              const impulse = getBoostImpulse(piece.rotationIndex);
              payload.other.rigidBody?.applyImpulse(
                { x: impulse[0], y: impulse[1], z: impulse[2] },
                true,
              );
            }
            // Only track bucket entry/exit on the sensor collider,
            // not on walls/floor (which would constantly clear the set
            // as the marble bounces against bucket surfaces).
            if (piece.type === 'goal_bucket' && desc.sensor) {
              setMarbleInBucket(piece.id, true);
            }
          }}
          onIntersectionExit={(_payload) => {
            if (piece.type === 'goal_bucket' && desc.sensor) {
              setMarbleInBucket(piece.id, false);
            }
          }}
        />
      ))}
    </group>
  );
}

/**
 * PieceCollider — Renders Rapier colliders for all placed pieces
 * during Play mode. Supports all piece types via the collider descriptor system.
 *
 * Each piece is wrapped in a group with the correct Y-axis rotation,
 * and child colliders are positioned/rotated relative to the piece's local space.
 */
export function PieceCollider() {
  const machineState = useGameStore((s) => s.machineState);
  const placedPieces = useGameStore((s) => s.placedPieces);
  const launchpadPosition = useGameStore((s) => s.launchpadPosition);

  const isPlaying =
    machineState === 'PLAYING' || machineState === 'SANDBOX_PLAYING';

  if (!isPlaying) return null;

  const launchpadDesc = getLaunchpadColliders()[0];

  return (
    <group>
      {/* Colliders for placed pieces */}
      {placedPieces.map((piece) => (
        <PieceColliderInner key={piece.id} piece={piece} />
      ))}

      {/* Launchpad collider — always present at launchpad position */}
      <group position={launchpadPosition}>
        <CuboidCollider
          args={launchpadDesc.halfExtents}
          position={launchpadDesc.position}
          rotation={launchpadDesc.rotation}
          sensor={launchpadDesc.sensor}
          restitution={launchpadDesc.restitution}
        />
      </group>
    </group>
  );
}
