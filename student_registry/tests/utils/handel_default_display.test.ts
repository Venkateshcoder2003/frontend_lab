import { handleDefaultDisplay } from "../../utils/handel_default_display";
import { StudentManager } from "../../services/student_manager";
import { Logger } from "../../utils/logger";

jest.mock("../../services/student_manager");
jest.mock("../../utils/logger");

const mockedStudentManager = {
  sortStudentsBy: jest.fn(),
  displayStudents: jest.fn(),
};

const mockedLogger = Logger as jest.Mocked<typeof Logger>;

// Mock the StudentManager.getInstance to return our mocked instance
(StudentManager.getInstance as jest.Mock).mockReturnValue(mockedStudentManager);

describe("handleDefaultDisplay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should log the default display message", async () => {
    await handleDefaultDisplay();

    expect(mockedLogger.info).toHaveBeenCalledWith(
      "Displaying student data sorted in ascending order by Full Name and then by Roll Number."
    );
  });

  it("should call sortStudentsBy with correct parameters", async () => {
    await handleDefaultDisplay();

    expect(mockedStudentManager.sortStudentsBy).toHaveBeenCalledWith(
      "fullName",
      "asc"
    );
  });

  it("should call displayStudents", async () => {
    await handleDefaultDisplay();

    expect(mockedStudentManager.displayStudents).toHaveBeenCalledTimes(1);
  });

  it("should get StudentManager instance", async () => {
    await handleDefaultDisplay();

    expect(StudentManager.getInstance).toHaveBeenCalledTimes(1);
  });

  it("should call all required methods", async () => {
    await handleDefaultDisplay();

    expect(mockedLogger.info).toHaveBeenCalled();
    expect(mockedStudentManager.sortStudentsBy).toHaveBeenCalled();
    expect(mockedStudentManager.displayStudents).toHaveBeenCalled();
  });
});
