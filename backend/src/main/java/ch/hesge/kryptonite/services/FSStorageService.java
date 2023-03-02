package ch.hesge.kryptonite.services;

import ch.hesge.kryptonite.storage.StorageException;
import ch.hesge.kryptonite.storage.StorageFileNotFoundException;
import ch.hesge.kryptonite.storage.StorageProperties;
import ch.hesge.kryptonite.storage.StorageService;
import ch.hesge.kryptonite.utils.TerminalRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.stream.Stream;


/**
 * Spring service that provides methods for interacting with a File System.
 */
@Service
public class FSStorageService implements StorageService {

    private final Path rootLocation;

    /**
     * Constructor of FSStorageService. It sets the root location to the root path defined in StorageProperties
     */
    @Autowired
    public FSStorageService(StorageProperties properties) {
        this.rootLocation = Paths.get(properties.getLocation());
    }

    /**
     * Stores a file in the specified subdirectory within the location specified
     *
     * @param file    the multipart file to store
     * @param uuid    the UUID of the file
     * @param subPath the subdirectory within the root location to store the file
     * @return the final path where the file was stored
     * @throws StorageException if the file is empty or if an error occurs while storing the file
     */
    @Override
    public Path store(MultipartFile file, String uuid, String subPath) {
        try {
            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file.");
            }
            createIfNotExist(uuid + "/" + subPath);

            Path newRootPath = Path.of(rootLocation + "/" + uuid + "/" + subPath);
            Path destinationFile = newRootPath.resolve(
                            Paths.get(Objects.requireNonNull(file.getOriginalFilename())))
                    .normalize()
                    .toAbsolutePath();

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                        StandardCopyOption.REPLACE_EXISTING);
            }

            TerminalRunner.shell("unp", String.valueOf(newRootPath), file.getOriginalFilename());
            TerminalRunner.shell("rm", String.valueOf(newRootPath), file.getOriginalFilename());

            return newRootPath;
        } catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    /**
     * Returns a stream of paths to all files stored at the location specified by the StorageProperties object.
     *
     * @return a stream of paths to all stored files
     * @throws StorageException if an error occurs while reading stored files
     */
    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        } catch (IOException e) {
            throw new StorageException("Failed to read stored files", e);
        }

    }

    /**
     * Load and return a path to the specified filename
     *
     * @param filename the file to load
     * @return a Path to file
     */
    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    /**
     * Returns a Resource representing a specific file
     *
     * @param filename the name of the file to load
     * @return a Resource representing the specified file
     * @throws StorageFileNotFoundException if the specified file cannot be read
     */
    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageFileNotFoundException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Could not read file: " + filename, e);
        }
    }

    /**
     * Deletes all files and directories in rootLocation
     */
    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    /**
     * Attempts to create root directory if it doesn't exist
     */
    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }

    /**
     * Attempts to create all subdirectories inside root directory if they don't exist
     */
    @Override
    public void createIfNotExist(String subdirectory) {
        try {
            Files.createDirectories(Path.of(rootLocation + "/" + subdirectory));
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }

    /**
     * Creates the check50 directory inside the assessment directory. It also creates necessary files for check50, like
     * __init__.py and .cs50.yml files.
     *
     * @param uuid      uuid of the assessment
     * @param checkData check data, more specifically python file containing all checks for the referenced assessment
     * @return Path to the check50 folder
     */
    @Override
    public Path createCheck50Dir(String uuid, String checkData) {
        try {
            Path check50Path = Path.of(rootLocation + "/" + uuid + "/" + "check50");

            InputStream inputStream = Objects.requireNonNull(FSStorageService.class.getClassLoader().getResourceAsStream(".cs50.yml"));
            Files.createDirectories(check50Path);
            Files.writeString(Path.of(check50Path + "/__init__.py"), checkData);
            Files.write(Path.of(check50Path + "/.cs50.yml"), inputStream.readAllBytes());

            return check50Path;
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }
}
