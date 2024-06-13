package com.ToDo.Trabalho.controllers;

import com.ToDo.Trabalho.model.Task;
import com.ToDo.Trabalho.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks") // Adiciona o mapeamento base para todas as rotas
public class TaskController {

    @Autowired
    private TaskRepository repositorio;

    @GetMapping
    public ResponseEntity<List<Task>> getTasks() {
        List<Task> tasks = repositorio.findAll();
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    @CrossOrigin(origins = "http://localhost:8081")
    public ResponseEntity<Task> salvarTask(@RequestBody Task task) {
        Task taskSalva = repositorio.save(task);
        return new ResponseEntity<>(taskSalva, HttpStatus.CREATED);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerTask(@PathVariable("id") long id) {
        repositorio.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/concluir")
    public ResponseEntity<Task> concluirTask(@PathVariable("id") long id, @RequestBody Task updatedTask) {
        Optional<Task> optionalTask = repositorio.findById(id);
        if (optionalTask.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Task task = optionalTask.get();
        task.setConcluida(updatedTask.isConcluida());
        repositorio.save(task);
        return new ResponseEntity<>(task, HttpStatus.OK);
    }
}
