import { MenuController } from "../utils/menu_controller";

//This replaces the real class with a fake version
jest.mock("../utils/menu_controller");

//Create a typed mock for easier access
const mockedMenuController = MenuController as jest.MockedClass<
  typeof MenuController
>;

describe("Application Entry Point", () => {
  //Before each test, clear the history of our mock
  beforeEach(() => {
    mockedMenuController.mockClear();
  });

  it("should create a MenuController instance and call showMenu once", () => {
    //Arrange: No setup is needed because importing the file is the action

    //Act: Import the main application file
    //When this line runs, the code inside 'index.ts' will execute
    require("../index"); //Assuming your main file is named index.ts

    //Was the MenuController constructor called exactly one time?
    expect(MenuController).toHaveBeenCalledTimes(1);

    //Was the showMenu method called on the instance that was created?
    const mockInstance = mockedMenuController.mock.instances[0];
    const mockShowMenu = mockInstance.showMenu;
    expect(mockShowMenu).toHaveBeenCalledTimes(1);
  });
});
