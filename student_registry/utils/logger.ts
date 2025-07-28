// Logger class for standard logging throughout the application.
export class Logger {
  static info(message: string) {
    console.log(`[studentRegistry]${message}`);
  }
  static error(error: string) {
    console.log(`[studentRegistry]${error}`);
  }
  static print(message: string) {
    console.log(`${message}`);
  }
  static log(user: any) {
    console.log(
      `[studentRegistry]Your added data is: [${user.fullName} ${user.rollNumber} ${user.age} ${user.address} ${user.course}]`
    );
  }
}
