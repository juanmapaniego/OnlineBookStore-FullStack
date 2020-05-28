package com.jmpaniego.onlinebookstore.repositories;

import com.jmpaniego.onlinebookstore.models.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource
public interface BookRepository extends JpaRepository<Book,Long> {
    @RestResource(path = "category")
    Page<Book> findByCategoryId(@Param("id") Long id, Pageable pageable);

    @RestResource(path = "bookname")
    Page<Book> findByBookNameContaining(@Param("name") String bookname, Pageable pageable);
}
