import * as readline from "readline";

export class AskQuery {
  private static rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  //Takes query and returns the input
  static async askQuery(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, (studentInput) => {
        resolve(studentInput.trim());
      });
    });
  }
  //Closes the readline interface to end input
  static close(): void {
    this.rl.close();
  }
}
