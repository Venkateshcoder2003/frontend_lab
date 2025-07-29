import { DataSerializer } from "../../services/data_serializer";
import { Student } from "../../models/student";
import { Logger } from "../../utils/logger";
import Course from "../../models/course";
import * as fs from "fs";

//Mock the dependencies
jest.mock("fs");
jest.mock("../../utils/logger");

//Create typed mocks for better autocompletion and type safety in our tests
const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedLogger = Logger as jest.Mocked<typeof Logger>;

describe("DataSerializer", () => {
  //A variable to hold the instance of the class we are testing
  let dataSerializer: DataSerializer;

  // Sample test data that conforms to the 'Student' type
  const testStudents: Student[] = [
    {
      fullName: "Alice Johnson",
      age: 20,
      address: "123 Main St",
      rollNumber: 1001,
      courses: Course[(Course.A, Course.B)],
      isSavedToDisk: false, // Start as unsaved
    },
  ];

  //This block runs before each individual test case
  beforeEach(() => {
    //Clear the history of all mocks to ensure tests are independent
    jest.clearAllMocks();
    //Get the singleton instance for each test
    dataSerializer = DataSerializer.getInstance();
  });

  //Test suite for the saveDataToDisk method
  describe("saveDataToDisk", () => {
    it("should save data successfully with the correct path and formatting", () => {
      //Arrange Set up the test. We tell the fake writeFileSync to do nothing
      mockedFs.writeFileSync.mockImplementation(() => {});

      // Act: Call the method we want to test.
      dataSerializer.saveDataToDisk(testStudents);

      //Assert: Check if the outcome is what we expected.
      //Was the fake writeFileSync called exactly once?
      expect(mockedFs.writeFileSync).toHaveBeenCalledTimes(1);
      //Was it called with the EXACT correct arguments?
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        "./data/student_data.json", // The file path from the class
        JSON.stringify(testStudents, null, 2), // The data, pretty-printed
        "utf-8"
      );
    });

    it("should log an error when writeFileSync throws an error", () => {
      // Arrange: Force the mock to simulate a file system error.
      const writeError = new Error("Write permission denied");
      mockedFs.writeFileSync.mockImplementation(() => {
        throw writeError;
      });

      // Act: Call the method, which should catch the error.
      dataSerializer.saveDataToDisk(testStudents);

      // Assert: Check if our error handling logic worked.
      expect(mockedLogger.error).toHaveBeenCalledTimes(1);
      expect(mockedLogger.error).toHaveBeenCalledWith(
        `Failed to save data: ${writeError}`
      );
    });
  });

  //Test suite for the loadDataFromDisk method.
  describe("loadDataFromDisk", () => {
    it("should load, parse, and preserve the isSavedToDisk flag successfully", () => {
      // Arrange: Simulate a file where the students are already marked as saved.
      // This is what the real file would contain.
      const studentsInFile: Student[] = [
        { ...testStudents[0], isSavedToDisk: true },
        { ...testStudents[1], isSavedToDisk: true },
      ];
      const rawJsonData = JSON.stringify(studentsInFile);

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(rawJsonData);

      // Act: Call the method.
      const result = dataSerializer.loadDataFromDisk();

      // Assert: The result from the function should be identical to what was in the file.
      expect(result).toEqual(studentsInFile);
    });

    it("should return an empty array when the file does not exist", () => {
      // Arrange: Simulate a file that does NOT exist.
      mockedFs.existsSync.mockReturnValue(false);

      // Act
      const result = dataSerializer.loadDataFromDisk();

      // Assert
      expect(result).toEqual([]); // The method should return an empty array.
      expect(mockedFs.readFileSync).not.toHaveBeenCalled(); // It shouldn't even try to read the file.
    });

    it("should return an empty array when the file is empty", () => {
      // Arrange: Simulate a file that exists but is empty.
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue("");

      // Act
      const result = dataSerializer.loadDataFromDisk();

      // Assert
      expect(result).toEqual([]);
    });

    it("should log an error and return an empty array for invalid JSON", () => {
      // Arrange: Simulate a file with corrupted content.
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue("this is not valid json");

      // Act
      const result = dataSerializer.loadDataFromDisk();

      // Assert
      expect(mockedLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to load data:") // Check that an error was logged.
      );
      expect(result).toEqual([]); // It should return an empty array.
    });
  });
});
