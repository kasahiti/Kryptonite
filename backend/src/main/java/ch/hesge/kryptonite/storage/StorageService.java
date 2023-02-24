package ch.hesge.kryptonite.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {
    void init();

    Path store(MultipartFile file, String uuid, String subPath);

    Stream<Path> loadAll();

    Path load(String filename);

    Resource loadAsResource(String filename);

    void deleteAll();

    void createIfNotExist(String subdirectory);


    Path createCheck50Dir(String uuid, String checkData);
}
