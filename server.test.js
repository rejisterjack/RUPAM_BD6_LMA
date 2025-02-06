const {
  app,
  travelPackages,
  bookings,
  validateBooking,
  addBooking,
} = require("./server")
const http = require("http")
const request = require("supertest")

jest.mock("./server", () => ({
  ...jest.requireActual("./server"),
  validateBooking: jest.fn(),
  addBooking: jest.fn(),
}))

let server

beforeAll((done) => {
  server = http.createServer(app)
  server.listen(3010, done)
})

afterAll((done) => {
  server.close(done)
})

describe("BD6 LMA", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("Test 1: Retrieve All Packages", async () => {
    const response = await request(server).get("/packages")
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ packages: travelPackages })
  })

  test("Test 2: Retrieve Package by Destination", async () => {
    const output = {
      packageId: 1,
      destination: "Paris",
      price: 1500,
      duration: 7,
      availableSlots: 10,
    }
    const response = await request(server).get("/packages/Paris")
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ package: output })
  })

  test("Test 2: Retrieve Package by Destination Error", async () => {
    const response = await request(server).get("/packages/Parisalsa")
    expect(response.statusCode).toBe(404)
  })

  test("Test 3: Add a New Booking", async () => {
    const currentBooking = {
      packageId: 4,
      customerName: "Raj Kulkarni",
      bookingDate: "2024-12-20",
      seats: 2,
    }
    const newBooking = {
      bookingId: bookings.length + 1,
      ...currentBooking,
    }
    addBooking.mockResolvedValue(newBooking)
    const response = await request(server)
      .post("/bookings")
      .send(currentBooking)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ booking: newBooking })
  })

  test("Test 4: Update Available Slots", async () => {
    const expectedValue = {
      packageId: 1,
      destination: "Paris",
      price: 1500,
      duration: 7,
      availableSlots: 8,
    }
    const response = await request(server).post("/packages/update-seats").send({
      packageId: 1,
      seatsBooked: 2,
    })
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ package: expectedValue })
  })

  test("Test 5: Retrieve Bookings for a Package", async () => {
    const expectedValue = [
      {
        bookingId: 1,
        packageId: 1,
        customerName: "Anjali Seth",
        bookingDate: "2024-12-01",
        seats: 2,
      },
    ]

    const response = await request(server).get("/bookings/1")
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      bookings: expectedValue,
    })
  })
})
