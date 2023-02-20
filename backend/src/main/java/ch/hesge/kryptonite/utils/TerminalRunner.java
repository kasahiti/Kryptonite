package ch.hesge.kryptonite.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class TerminalRunner {
    private TerminalRunner() { }
    public static void shell(String command, String path, String... args) {
        ProcessBuilder processBuilder = new ProcessBuilder();

        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exit = process.waitFor();
            if (exit == 0) {
                System.out.println("Success");
                System.out.println(output);
            }
        } catch (IOException | InterruptedException e) {
            System.err.println(e);
        }
    }
}
