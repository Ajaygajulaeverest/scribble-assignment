import { beforeEach, describe, expect, it } from "vitest";
import { createRoom, getRoom, joinRoom, resetRoomsForTests, startGame, toRoomSnapshot } from "./roomStore.js";

describe("roomStore", () => {
  beforeEach(() => {
    resetRoomsForTests();
  });

  it("createRoom returns a room with a 4-character uppercase code", () => {
    const result = createRoom("Alice");

    expect(result.room.code).toMatch(/^[A-Z0-9]{4}$/);
    expect(result.room.participants).toHaveLength(1);
    expect(result.room.participants[0].name).toBe("Alice");
    expect(result.room.hostParticipantId).toBe(result.participantId);
    expect(result.participantId).toBeDefined();
  });

  it("joinRoom returns null for an unknown room code", () => {
    const result = joinRoom("ZZZZ", "Bob");

    expect(result).toBeNull();
  });

  it("keeps participants isolated by room code", () => {
    const firstRoom = createRoom("Alice");
    const secondRoom = createRoom("Carol");

    joinRoom(firstRoom.room.code, "Bob");

    expect(getRoom(firstRoom.room.code)?.participants.map((participant) => participant.name)).toEqual(["Alice", "Bob"]);
    expect(getRoom(secondRoom.room.code)?.participants.map((participant) => participant.name)).toEqual(["Carol"]);
  });

  it("marks the snapshot viewer as host only for the host participant", () => {
    const host = createRoom("Alice");
    const guest = joinRoom(host.room.code, "Bob");

    expect(guest).not.toBeNull();
    expect(toRoomSnapshot(host.room, host.participantId).isHost).toBe(true);
    expect(toRoomSnapshot(host.room, guest!.participantId).isHost).toBe(false);
  });

  it("rejects start attempts from non-host participants", () => {
    const host = createRoom("Alice");
    const guest = joinRoom(host.room.code, "Bob");

    expect(guest).not.toBeNull();
    const result = startGame(host.room.code, guest!.participantId);

    expect(result.ok).toBe(false);
    expect(result).toMatchObject({
      statusCode: 403,
      message: "Only the host can start the game"
    });
  });

  it("requires at least 2 participants to start", () => {
    const host = createRoom("Alice");
    const result = startGame(host.room.code, host.participantId);

    expect(result.ok).toBe(false);
    expect(result).toMatchObject({
      statusCode: 400,
      message: "At least 2 players are required to start"
    });
  });

  it("allows the host to start when at least 2 participants are present", () => {
    const host = createRoom("Alice");
    joinRoom(host.room.code, "Bob");

    const result = startGame(host.room.code, host.participantId);

    expect(result.ok).toBe(true);
    expect(result.ok ? result.room.status : null).toBe("playing");
  });
});
