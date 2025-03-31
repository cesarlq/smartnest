/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { MongoClient, ObjectId } from 'mongodb';
import { newUserI } from '../lib/interfaces/users';
import { TaskI, SubTask, Comment } from '../lib/interfaces/taskInterface';

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

export async function connectDB() {
  await client.connect();
  return client.db("SmartNest"); 
}

export async function getUsersCollection() {
  const db = await connectDB();
  return db.collection("Users");
}

export async function getTaskCollection() {
  const db = await connectDB();
  return db.collection("tasks");
}

//Añadir una tarea
export async function addTask({newTask}: {newTask: TaskI}){
  const collection = await getTaskCollection();

  const taskToInsert = { ...newTask };
  if (taskToInsert._id) {
    delete taskToInsert._id;
  }
  return await collection.insertOne(taskToInsert as any);
}

//Buscar todas las tareas
export async function getAllTasks() {
  const collection = await getTaskCollection();
  return await collection.find({}).toArray();
}

// Actualizar una tarea existente
export async function updateTask(taskId: string, updateData: Partial<TaskI>) {
  const collection = await getTaskCollection();
  return await collection.updateOne(
    { _id: new ObjectId(taskId) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
}

// Agregar una subtarea a una tarea existente
export async function addSubTaskToTask(taskId: string, subTask: Omit<SubTask, 'id' | 'taskId'>) {
  const collection = await getTaskCollection();
  const newSubTask = {
    ...subTask,
    id: new ObjectId().toString(),
    taskId: taskId,
    createdAt: new Date()
  };
  
  return await collection.updateOne(
    { _id: new ObjectId(taskId) },
    {
      $push: { subTasks: newSubTask } as any,
      $set: { updatedAt: new Date() }
    }
  );
}

// Agregar un comentario a una tarea existente
export async function addCommentToTask(taskId: string, comment: Omit<Comment, 'id'>) {
  const collection = await getTaskCollection();
  const newComment = {
    ...comment,
    id: new ObjectId().toString(),
    createdAt: new Date()
  };
  
  return await collection.updateOne(
    { _id: new ObjectId(taskId) },
    {
      $push: { comments: newComment } as any,
      $set: { updatedAt: new Date() }
    }
  );
}

// Añadir un nuevo usuario
export async function addUser({newUser}: {newUser: newUserI}){
  const collection = await getUsersCollection();
  return await collection.insertOne(newUser);
}

// Buscar un usuario por email (ejemplo común)
export async function findUserByEmail(email: string) {
  const collection = await getUsersCollection();
  return await collection.findOne({ email: email });
}

// Buscar un usuario por ID
export async function findUserById(userId: string) {
  const collection = await getUsersCollection();
  return await collection.findOne({ _id: new ObjectId(userId) });
}

// Búsqueda flexible por diferentes criterios
export async function findUser(query: Partial<newUserI>) {
  const collection = await getUsersCollection();
  return await collection.findOne(query);
}

// Verificar si existe un usuario con determinado email y contraseña (para login)
export async function findUserForLogin(email: string, password: string) {
  const collection = await getUsersCollection();
  return await collection.findOne({ email: email, password: password });
}