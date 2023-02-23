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

    public static void shell(String command, String path, String... args) {
        List<String> commandList = new ArrayList<>();
        commandList.add(command);
        commandList.addAll(Arrays.asList(args));

        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command(commandList);
        processBuilder.directory(new File(path));
        processBuilder.inheritIO();

        try {
            Process process = processBuilder.start();
            int exit = process.waitFor();
            if (exit == 0) {
                System.out.println("Success");
            }
        } catch (IOException | InterruptedException e) {
            System.err.println(e);
        }
    }
}
