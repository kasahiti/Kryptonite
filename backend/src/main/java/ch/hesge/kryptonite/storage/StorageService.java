package ch.hesge.kryptonite.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {
    void init();

    void store(MultipartFile file, String uuid, String subPath);

    Stream<Path> loadAll();

    Path load(String filename);

    Resource loadAsResource(String filename);

    void deleteAll();

    void createIfNotExist(String subdirectory);


    public void createCheck50Dir(String uuid, String checkData);
}
