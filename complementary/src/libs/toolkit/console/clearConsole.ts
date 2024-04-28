/**
 * Clear the console
 */
export default function clearConsole():void {
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
    process.stdout.write('\x1B[2J\x1B[0f');
}
