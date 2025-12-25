import * as readline from "node:readline";
// Parking lot LLD practice in TypeScript.
var VehicleType;
(function (VehicleType) {
    VehicleType["Bike"] = "BIKE";
    VehicleType["Car"] = "CAR";
    VehicleType["Truck"] = "TRUCK";
})(VehicleType || (VehicleType = {}));
class ParkingSlot {
    id;
    supportedTypes;
    currentVehicle = null;
    constructor(id, supportedTypes) {
        this.id = id;
        this.supportedTypes = supportedTypes;
    }
    isFree() {
        return this.currentVehicle === null;
    }
    canFit(vehicle) {
        return this.supportedTypes.has(vehicle.type);
    }
    assign(vehicle) {
        if (!this.isFree() || !this.canFit(vehicle)) {
            return false;
        }
        this.currentVehicle = vehicle;
        return true;
    }
    release() {
        const released = this.currentVehicle;
        this.currentVehicle = null;
        return released;
    }
}
class ParkingFloor {
    level;
    slots;
    constructor(level, slots) {
        this.level = level;
        this.slots = slots;
    }
    findSlot(vehicle) {
        return (this.slots.find((slot) => slot.isFree() && slot.canFit(vehicle)) ?? null);
    }
    getFreeSlotsByType(type) {
        return this.slots.filter((slot) => slot.isFree() && slot.canFit({ plate: "", type })).length;
    }
}
class ParkingTicket {
    id;
    vehicle;
    floorLevel;
    slotId;
    entryTime;
    constructor(id, vehicle, floorLevel, slotId, entryTime = Date.now()) {
        this.id = id;
        this.vehicle = vehicle;
        this.floorLevel = floorLevel;
        this.slotId = slotId;
        this.entryTime = entryTime;
    }
}
class FlatRatePricing {
    hourlyRate;
    constructor(hourlyRate) {
        this.hourlyRate = hourlyRate;
    }
    calculateFee(entryTime, exitTime) {
        const durationMs = exitTime - entryTime;
        const hours = Math.max(1, Math.ceil(durationMs / (60 * 60 * 1000)));
        return hours * this.hourlyRate;
    }
}
class ParkingLot {
    name;
    pricingStrategy;
    floors = [];
    activeTickets = new Map();
    ticketCounter = 0;
    constructor(name, pricingStrategy) {
        this.name = name;
        this.pricingStrategy = pricingStrategy;
    }
    registerFloor(floor) {
        this.floors.push(floor);
    }
    park(vehicle) {
        for (const floor of this.floors) {
            const slot = floor.findSlot(vehicle);
            if (slot && slot.assign(vehicle)) {
                const ticketId = `T-${++this.ticketCounter}`;
                const ticket = new ParkingTicket(ticketId, vehicle, floor.level, slot.id);
                this.activeTickets.set(ticketId, { ticket, slot });
                return ticket;
            }
        }
        return null;
    }
    unpark(ticketId) {
        const active = this.activeTickets.get(ticketId);
        if (!active) {
            throw new Error(`Invalid ticket ${ticketId}`);
        }
        active.slot.release();
        this.activeTickets.delete(ticketId);
        const exitTime = Date.now();
        const fee = this.pricingStrategy.calculateFee(active.ticket.entryTime, exitTime, active.slot);
        return {
            fee,
            durationMs: exitTime - active.ticket.entryTime,
        };
    }
    getAvailability(type) {
        return this.floors.reduce((count, floor) => count + floor.getFreeSlotsByType(type), 0);
    }
}
// --- Demo / driver code ---
const createSlot = (id, types) => new ParkingSlot(id, new Set(types));
const level1 = new ParkingFloor(1, [
    createSlot("1-A", [VehicleType.Bike]),
    createSlot("1-B", [VehicleType.Car, VehicleType.Bike]),
    createSlot("1-C", [VehicleType.Car]),
]);
const level2 = new ParkingFloor(2, [
    createSlot("2-A", [VehicleType.Car]),
    createSlot("2-B", [VehicleType.Truck]),
    createSlot("2-C", [VehicleType.Car, VehicleType.Truck]),
]);
const parkingLot = new ParkingLot("City Center Lot", new FlatRatePricing(20));
parkingLot.registerFloor(level1);
parkingLot.registerFloor(level2);
const sedan = { plate: "KA-01-1234", type: VehicleType.Car };
const bike = { plate: "KA-02-BIKE", type: VehicleType.Bike };
const carTicket = parkingLot.park(sedan);
const bikeTicket = parkingLot.park(bike);
console.log("Car ticket:", carTicket);
console.log("Bike ticket:", bikeTicket);
console.log("Free car slots:", parkingLot.getAvailability(VehicleType.Car));
if (carTicket) {
    setTimeout(() => {
        const receipt = parkingLot.unpark(carTicket.id);
        console.log(`Car exited. Fee: ₹${receipt.fee}`, receipt);
    }, 1500);
}
// --- Simple CLI controller for manual practice ---
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "lot> ",
});
const help = "Commands: park <plate> <type>, unpark <ticket>, availability <type>, exit";
const handleCommand = (line) => {
    const [cmdRaw, ...args] = line.trim().split(/\s+/);
    const cmd = (cmdRaw ?? "").toLowerCase();
    try {
        switch (cmd) {
            case "park": {
                const [plate, type] = args;
                if (!plate || !type) {
                    console.log("Usage: park <plate> <BIKE|CAR|TRUCK>");
                    break;
                }
                const ticket = parkingLot.park({
                    plate,
                    type: type.toUpperCase(),
                });
                console.log(ticket ? `Ticket: ${ticket.id}` : "No slot available");
                break;
            }
            case "unpark": {
                const [ticketId] = args;
                if (!ticketId) {
                    console.log("Usage: unpark <ticketId>");
                    break;
                }
                const receipt = parkingLot.unpark(ticketId);
                console.log(`Vehicle exited. Fee: ₹${receipt.fee}, duration: ${receipt.durationMs}ms`);
                break;
            }
            case "availability": {
                const [type] = args;
                if (!type) {
                    console.log("Usage: availability <BIKE|CAR|TRUCK>");
                    break;
                }
                const free = parkingLot.getAvailability(type.toUpperCase());
                console.log(`${free} slots available for ${type.toUpperCase()}`);
                break;
            }
            case "help":
                console.log(help);
                break;
            case "exit":
                rl.close();
                return;
            case "":
                break;
            default:
                console.log(help);
        }
    }
    catch (err) {
        console.error("Error:", err.message);
    }
    rl.prompt();
};
console.log(help);
rl.prompt();
rl.on("line", handleCommand).on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
});
//# sourceMappingURL=main.js.map