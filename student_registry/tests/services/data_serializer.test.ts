// tests/services/data_serializer.test.ts
import { DataSerializer } from "../../services/data_serializer";
import { Student } from "../../models/student";
import { Logger } from "../../utils/logger";
import Course from "../../models/course";
import * as fs from "fs";

// Mock the dependencies to isolate the DataSerializer class
jest.mock("fs");
jest.mock("../../utils/logger");

// Create typed mocks for better autocompletion and type safety
const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedLogger = Logger as jest.Mocked<typeof Logger>;

describe("DataSerializer", () => {
  let dataSerializer: DataSerializer;

  // Sample test data using the correct 'Student' type
  const testStudents: Student[] = [
    {
      fullName: "Alice Johnson",
      age: 20,
      address: "123 Main St",
      rollNumber: 1001,
      courses: Course[Course.A, Course.B, Course.C, Course.D],
    },
    {
      fullName: "Bob Smith",
      age: 22,
      address: "456 Oak Ave",
      rollNumber: 1002,
      courses: Course[Course.B, Course.C, Course.D, Course.E],
    },
  ];

  // This block runs before each individual test
  beforeEach(() => {
    // Clear mock history to ensure tests are independent
    jest.clearAllMocks();
    // Get the singleton instance for each test
    dataSerializer = DataSerializer.getInstance();
  });

  describe("Singleton Pattern", () => {
    test("should always return the same instance", () => {
      // Act
      const instance1 = DataSerializer.getInstance();
      const instance2 = DataSerializer.getInstance();

      // Assert
      expect(instance1).toBe(instance2);
    });
  });

  describe("saveDataToDisk", () => {
    test("should save data successfully with correct path and formatting", () => {
      // Arrange
      mockedFs.writeFileSync.mockImplementation(() => {}); // Mock the file write to do nothing

      // Act
      dataSerializer.saveDataToDisk(testStudents);

      // Assert
      expect(mockedFs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        "./data/student_data.json", // Use the correct file path from the class
        JSON.stringify(testStudents, null, 2),
        "utf-8"
      );
    });

    test("should handle saving an empty array", () => {
      // Arrange
      mockedFs.writeFileSync.mockImplementation(() => {});

      // Act
      dataSerializer.saveDataToDisk([]);

      // Assert
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        "./data/student_data.json",
        JSON.stringify([], null, 2),
        "utf-8"
      );
    });

    test("should log an error when writeFileSync throws an error", () => {
      // Arrange
      const writeError = new Error("Write permission denied");
      mockedFs.writeFileSync.mockImplementation(() => {
        throw writeError;
      });

      // Act
      dataSerializer.saveDataToDisk(testStudents);

      // Assert
      expect(mockedLogger.error).toHaveBeenCalledTimes(1);
      expect(mockedLogger.error).toHaveBeenCalledWith(
        `Failed to save data: ${writeError}`
      );
    });
  });

  describe("loadDataFromDisk", () => {
    test("should load and parse data successfully when file exists", () => {
      // Arrange
      const jsonData = JSON.stringify(testStudents);
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(jsonData);

      // Act
      const result = dataSerializer.loadDataFromDisk();

      // Assert
      expect(mockedFs.existsSync).toHaveBeenCalledWith(
        "./data/student_data.json"
      );
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(
        "./data/student_data.json",
        "utf-8"
      );
      expect(result).toEqual(testStudents);
    });

    test("should return an empty array when file does not exist", () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(false);

      // Act
      const result = dataSerializer.loadDataFromDisk();

      // Assert
      expect(result).toEqual([]);
      expect(mockedFs.readFileSync).not.toHaveBeenCalled();
    });

    test("should return an empty array when file is empty or contains only whitespace", () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue("   \n\t  ");

      // Act
      const result = dataSerializer.loadDataFromDisk();

      // Assert
      expect(result).toEqual([]);
    });

    test("should log an error and return an empty array when readFileSync fails", () => {
      // Arrange
      const readError = new Error("File read error");
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockImplementation(() => {
        throw readError;
      });

      // Act
      const result = dataSerializer.loadDataFromDisk();

      // Assert
      expect(mockedLogger.error).toHaveBeenCalledWith(
        `Failed to load data: ${readError}`
      );
      expect(result).toEqual([]);
    });

    test("should log an error and return an empty array for invalid JSON", () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue("invalid json {");

      // Act
      const result = dataSerializer.loadDataFromDisk();

      // Assert
      expect(mockedLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to load data:")
      );
      expect(result).toEqual([]);
    });
  });

  describe("Integration: Save and Load", () => {
    test("should save and then load data, maintaining consistency", () => {
      // Arrange
      let inMemoryStorage = "";
      mockedFs.writeFileSync.mockImplementation((path, data) => {
        inMemoryStorage = data as string;
      });
      mockedFs.readFileSync.mockImplementation(() => inMemoryStorage);
      mockedFs.existsSync.mockReturnValue(true);

      // Act 1: Save the data
      dataSerializer.saveDataToDisk(testStudents);

      // Act 2: Load the data
      const loadedStudents = dataSerializer.loadDataFromDisk();

      // Assert
      expect(loadedStudents).toEqual(testStudents);
    });
  });
});
