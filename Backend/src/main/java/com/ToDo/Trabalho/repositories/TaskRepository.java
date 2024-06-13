package com.ToDo.Trabalho.repositories;


import com.ToDo.Trabalho.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
