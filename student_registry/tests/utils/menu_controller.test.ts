// tests/controllers/menu_controller.test.ts
import { MenuContoller } from "../../utils/menu_controller";
import { StudentManager } from "../../services/student_manager";
import { DataSerializer } from "../../services/data_serializer";
import { InputHandler } from "../../utils/input_handler";
import { Logger } from "../../utils/logger";
import { choices } from "../../models/choices";
import * as menuActions from "../../utils/menu_actions";
import { Student } from "../../models/student";
import Course from "../../models/course";

// Mock all dependencies to isolate the MenuController
jest.mock("../../services/student_manager");
jest.mock("../../services/data_serializer");
jest.mock("../../utils/input_handler");
jest.mock("../../utils/logger");
// Mock the entire menu_actions module
jest.mock("../../utils/menu_actions");

describe("MenuContoller", () => {
  // Create typed mocks for better autocompletion and type safety
  const mockedStudentManager = StudentManager.getInstance as jest.Mock;
  const mockedDataSerializer = DataSerializer.getInstance as jest.Mock;
  const mockedInputHandler = InputHandler as jest.Mocked<typeof InputHandler>;
  const mockedMenuActions = menuActions as jest.Mocked<typeof menuActions>;

  // Runs before each test to reset mocks and instances
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should load data from the serializer and set it in the manager on startup", () => {
      // Arrange: Prepare sample data to be "loaded"
      const sampleStudents: Student[] = [
        {
          fullName: "Test Student",
          age: 21,
          address: "Test Address",
          rollNumber: 1,
          courses: Course[Course.A],
        },
      ];
      // Mock the return value of loadDataFromDisk
      mockedDataSerializer.mockReturnValue({
        loadDataFromDisk: jest.fn().mockReturnValue(sampleStudents),
      });
      const setStudentsMock = jest.fn();
      mockedStudentManager.mockReturnValue({ setStudents: setStudentsMock });

      // Act: Create an instance of the controller, which triggers initialization
      new MenuContoller();

      // Assert: Verify that the data was loaded and set correctly
      expect(mockedDataSerializer().loadDataFromDisk).toHaveBeenCalledTimes(1);
      expect(setStudentsMock).toHaveBeenCalledWith(sampleStudents);
    });

    it("should set an empty array if loading data throws an error", () => {
      // Arrange: Make the loader throw an error
      mockedDataSerializer.mockReturnValue({
        loadDataFromDisk: jest.fn().mockImplementation(() => {
          throw new Error("File not found");
        }),
      });
      const setStudentsMock = jest.fn();
      mockedStudentManager.mockReturnValue({ setStudents: setStudentsMock });

      // Act
      new MenuContoller();

      // Assert: Verify that an empty array was set
      expect(setStudentsMock).toHaveBeenCalledWith([]);
    });
  });

  describe("showMenu", () => {
    // Helper function to set up the controller for menu tests
    const setupController = () => {
      mockedDataSerializer.mockReturnValue({
        loadDataFromDisk: jest.fn().mockReturnValue([]),
      });
      mockedStudentManager.mockReturnValue({ setStudents: jest.fn() });
      return new MenuContoller();
    };

    it("should call handleAdd when user chooses ADD", async () => {
      // Arrange
      const menuController = setupController();
      // Simulate user choosing 'ADD' then 'EXIT'
      mockedInputHandler.getChoice
        .mockResolvedValueOnce(choices.ADD)
        .mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      expect(mockedMenuActions.handleAdd).toHaveBeenCalledTimes(1);
    });

    it("should call handleDisplay when user chooses DISPLAY", async () => {
      // Arrange
      const menuController = setupController();
      // Simulate user choosing 'DISPLAY' then 'EXIT'
      mockedInputHandler.getChoice
        .mockResolvedValueOnce(choices.DISPLAY)
        .mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      expect(mockedMenuActions.handleDisplay).toHaveBeenCalledTimes(1);
    });

    it("should call handleDelete when user chooses DELETE", async () => {
      // Arrange
      const menuController = setupController();
      // Simulate user choosing 'DELETE' then 'EXIT'
      mockedInputHandler.getChoice
        .mockResolvedValueOnce(choices.DELETE)
        .mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      expect(mockedMenuActions.handleDelete).toHaveBeenCalledTimes(1);
    });

    it("should call handleSave when user chooses SAVE", async () => {
      // Arrange
      const menuController = setupController();
      // Simulate user choosing 'SAVE' then 'EXIT'
      mockedInputHandler.getChoice
        .mockResolvedValueOnce(choices.SAVE)
        .mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      expect(mockedMenuActions.handleSave).toHaveBeenCalledTimes(1);
    });

    it("should call handleExit and terminate the loop when user chooses EXIT", async () => {
      // Arrange
      const menuController = setupController();
      // Simulate user choosing 'EXIT' immediately
      mockedInputHandler.getChoice.mockResolvedValueOnce(choices.EXIT);

      // Act
      await menuController.showMenu();

      // Assert
      expect(mockedMenuActions.handleExit).toHaveBeenCalledTimes(1);
      // Verify other actions were not called
      expect(mockedMenuActions.handleAdd).not.toHaveBeenCalled();
    });
  });
});
