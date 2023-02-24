package ch.hesge.kryptonite.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


/**
 * A utility class that provides a method for running a shell command and returning its output as a string.
 * This utility class is used by the Kryptonite to run the check50 to check the code of student projects.
 */
public class TerminalRunner {
    private TerminalRunner() { }

    /**
     * Runs the given shell command with the provided arguments in the given student project path, and returns the
     * output as a string.
     * @param command The command to run.
     * @param studentProjectPath The path to the student project directory.
     * @param args Additional arguments to pass to the command.
     * @return The output of the command as a string.
     */
    public static String shell(String command, String studentProjectPath, String... args) {
        List<String> commandList = new ArrayList<>();
        commandList.add(command);
        commandList.addAll(Arrays.asList(args));

        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command(commandList);
        processBuilder.directory(new File(studentProjectPath));

        var builder = new StringBuilder();
        String line;

        try {
            Process process = processBuilder.start();
            var reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            while ((line = reader.readLine()) != null) {
                builder.append(line);
                builder.append(System.getProperty("line.separator"));
            }

            process.waitFor();
            process.destroy();
        } catch (IOException | InterruptedException e) {
            System.err.println(e);
            return null;
        }

        return builder.toString();
    }
}
