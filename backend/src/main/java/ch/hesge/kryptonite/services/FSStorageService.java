package ch.hesge.kryptonite.services;

import ch.hesge.kryptonite.storage.StorageException;
import ch.hesge.kryptonite.storage.StorageFileNotFoundException;
import ch.hesge.kryptonite.storage.StorageProperties;
import ch.hesge.kryptonite.storage.StorageService;
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

@Service
public class FSStorageService implements StorageService {

    private final Path rootLocation;

    @Autowired
    public FSStorageService(StorageProperties properties) {
        this.rootLocation = Paths.get(properties.getLocation());
    }

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
            return newRootPath;
        } catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

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

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

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

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }

    @Override
    public void createIfNotExist(String subdirectory) {
        try {
            Files.createDirectories(Path.of(rootLocation + "/" + subdirectory));
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }

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
