import { MenuController } from "../../utils/menu_controller"; // Adjust path as needed
import { StudentManager } from "../../services/student_manager";
import { DataSerializer } from "../../services/data_serializer";
import { InputHandler } from "../../utils/input_handler";
import { Logger } from "../../utils/logger";
import { choices } from "../../models/choices";
import {
  handleAdd,
  handleDisplay,
  handleDelete,
  handleSave,
  handleExit,
} from "../../utils/menu_actions";

// Mock the dependencies, but not the class we are testing
jest.mock("../../services/student_manager");
jest.mock("../../services/data_serializer");
jest.mock("../../utils/input_handler");
jest.mock("../../utils/logger");
jest.mock("../../utils/menu_actions");

describe("MenuController", () => {
  // Define mock instances for our services
  let studentManagerMock: jest.Mocked<StudentManager>;
  let dataSerializerMock: jest.Mocked<DataSerializer>;

  // Before each test, we reset the mocks to ensure a clean state
  beforeEach(() => {
    // Clear all previous mock data and implementations
    jest.clearAllMocks();

    // Mock the singleton getInstance methods to return our controlled mock instances
    studentManagerMock = {
      initializeFromDisk: jest.fn(),
    } as any;
    dataSerializerMock = {
      loadDataFromDisk: jest.fn(),
    } as any;

    StudentManager.getInstance = jest.fn().mockReturnValue(studentManagerMock);
    DataSerializer.getInstance = jest.fn().mockReturnValue(dataSerializerMock);
  });

  describe("constructor and initialization", () => {
    it("should get instances of services and initialize data on creation", () => {
      // Arrange: mock the data loading to return an empty array
      dataSerializerMock.loadDataFromDisk.mockReturnValue([]);

      // Act: create a new MenuController instance
      new MenuController();

      // Assert: verify that the singletons were retrieved
      expect(StudentManager.getInstance).toHaveBeenCalledTimes(1);
      expect(DataSerializer.getInstance).toHaveBeenCalledTimes(1);
      // Assert: verify that data loading and initialization were attempted
      expect(dataSerializerMock.loadDataFromDisk).toHaveBeenCalledTimes(1);
      expect(studentManagerMock.initializeFromDisk).toHaveBeenCalledWith([]);
    });

    it("should handle errors during data initialization and start with an empty student list", () => {
      // Arrange: mock the data loading to throw an error
      const error = new Error("Failed to read file");
      dataSerializerMock.loadDataFromDisk.mockImplementation(() => {
        throw error;
      });

      // Act: create a new MenuController instance
      new MenuController();

      // Assert: verify that the error was logged
      expect(Logger.error).toHaveBeenCalledWith(
        `Failed to initialize data: ${error}`
      );
      // Assert: verify that the manager was initialized with an empty array as a fallback
      expect(studentManagerMock.initializeFromDisk).toHaveBeenCalledWith([]);
    });
  });

  describe("showMenu", () => {
    // Test each menu option by mocking user input
    it("should call handleAdd when user chooses ADD", async () => {
      // Arrange
      const menuController = new MenuController();
      // Mock user input to select "ADD" first, then "EXIT" to stop the loop
      (InputHandler.getChoice as jest.Mock)
        .mockResolvedValueOnce(choices.ADD)
        .mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      // FIX: Use the directly imported mock function
      expect(handleAdd).toHaveBeenCalledTimes(1);
    });

    it("should call handleDisplay when user chooses DISPLAY", async () => {
      // Arrange
      const menuController = new MenuController();
      (InputHandler.getChoice as jest.Mock)
        .mockResolvedValueOnce(choices.DISPLAY)
        .mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      // FIX: Use the directly imported mock function
      expect(handleDisplay).toHaveBeenCalledTimes(1);
    });

    it("should call handleDelete when user chooses DELETE", async () => {
      // Arrange
      const menuController = new MenuController();
      (InputHandler.getChoice as jest.Mock)
        .mockResolvedValueOnce(choices.DELETE)
        .mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      // FIX: Use the directly imported mock function
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });

    it("should call handleSave when user chooses SAVE", async () => {
      // Arrange
      const menuController = new MenuController();
      (InputHandler.getChoice as jest.Mock)
        .mockResolvedValueOnce(choices.SAVE)
        .mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      // FIX: Use the directly imported mock function
      expect(handleSave).toHaveBeenCalledTimes(1);
    });

    it("should call handleExit and terminate the loop when user chooses EXIT", async () => {
      // Arrange
      const menuController = new MenuController();
      (InputHandler.getChoice as jest.Mock).mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      // FIX: Use the directly imported mock function
      expect(handleExit).toHaveBeenCalledTimes(1);
      // Ensure no other action was called
      expect(handleAdd).not.toHaveBeenCalled();
    });

    it("should log an info message for an invalid choice", async () => {
      // Arrange
      const menuController = new MenuController();
      (InputHandler.getChoice as jest.Mock)
        .mockResolvedValueOnce("invalid_choice" as any) // Simulate invalid input
        .mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      expect(Logger.info).toHaveBeenCalledWith(
        "Invalid choice. Please select 1-5."
      );
    });

    it("should log an error if a menu action throws an exception", async () => {
      // Arrange
      const menuController = new MenuController();
      const error = new Error("Something went wrong");
      // FIX: Use the directly imported mock function
      (handleAdd as jest.Mock).mockRejectedValue(error);
      (InputHandler.getChoice as jest.Mock)
        .mockResolvedValueOnce(choices.ADD)
        .mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      expect(Logger.error).toHaveBeenCalledWith(
        `Error adding student: ${error.message}`
      );
    });
  });
});
