package ch.hesge.kryptonite.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TerminalRunner {
    private TerminalRunner() { }

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
