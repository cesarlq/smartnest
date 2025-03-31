/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config({ path: '.env.local' });

const port = process.env.PORT || 3003;
const JWT_SECRET = 'smartNest2809';

const mongoUri = process.env.MONGODB_URI || '';
console.log('MongoDB URI configurado correctamente');

async function connectToMongoDB() {
  if (!mongoUri) {
    console.error('Error: MONGODB_URI no está definido');
    return null;
  }

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Conexión a MongoDB establecida correctamente');
    return client;
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    return null;
  }
}

const server = express();

server.use(cors({
  origin: function(origin: any, callback: any) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  exposedHeaders: ['Set-Cookie', 'Date', 'ETag']
}));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());

server.get('/', (req: any, res: any) => {
  res.json({ message: 'Servidor Express funcionando correctamente' });
});

async function startServer() {
  try {
    const mongoClient = await connectToMongoDB();
    
    if (mongoClient) {
      const db = mongoClient.db('SmartNest');
      console.log('Base de datos SmartNest seleccionada correctamente');
      
      // Colecciones
      const usersCollection = db.collection('Users');
      const tasksCollection = db.collection('tasks');
      
      // ===== RUTAS DE AUTENTICACIÓN =====
      
      // Ruta para login
      server.post('/api/auth/login', async (req: { body: { email: any; password: any; }; }, res: any) => {
        try {
          console.log("Recibiendo solicitud de login");
          const { email, password } = req.body;
          
          if (!email || !password) {
            return res.status(400).json({
              success: false,
              message: 'Se requieren correo y contraseña'
            });
          }
          
          const user = await usersCollection.findOne({ email });
          if (!user) {
            return res.status(401).json({
              success: false,
              message: 'Usuario no encontrado'
            });
          }
          
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: 'Credenciales incorrectas'
            });
          }
          
          const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
          );

          
          
          // Configurar la cookie con el token
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            path: '/',
            sameSite: 'lax'
          });
          
          server.use((req: any, res: any, next: any) => {
            console.log(`${req.method} ${req.url}`);
            console.log('Headers:', req.headers);
            next();
          });

          res.json({
            success: true,
            token: token,
            user: {
              id: user._id,
              email: user.email,
              name: user.name
            }
          });


        } catch (error) {
          console.error("Error detallado:", error);
          res.status(500).json({
            success: false,
            message: 'Error del servidor',
            details: error instanceof Error ? error.message : String(error)
          });
        }
      });

      server.post('/api/auth/logout', (req:any, res:any) => {
        try {
          console.log("Procesando solicitud de logout");
          
          res.clearCookie('token', {
            httpOnly: true,
            path: '/',
            sameSite: 'lax'
          });

          res.json({
            success: true,
            message: 'Sesión cerrada correctamente'
          });
        } catch (error) {
          console.error("Error en logout:", error);
          res.status(500).json({
            success: false,
            message: 'Error al cerrar sesión',
            details: error instanceof Error ? error.message : String(error)
          });
        }
      });
      
      server.post('/api/auth/register', async (req: { body: { name: any; email: any; password: any; }; }, res: any) => {
        try {
          console.log("Recibiendo solicitud de registro");
          const { name, email, password } = req.body;
          
          if (!name || !email || !password) {
            return res.status(400).json({
              success: false,
              message: 'Se requieren nombre, correo y contraseña'
            });
          }
          
          const existingUser = await usersCollection.findOne({ email });
          if (existingUser) {
            return res.status(409).json({
              success: false,
              message: 'Este correo electrónico ya está registrado'
            });
          }
          
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          
          const newUser = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
          };
          
          const result = await usersCollection.insertOne(newUser);
          
          const token = jwt.sign(
            { id: result.insertedId, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '1h' }
          );
          
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            path: '/',
            sameSite: 'lax'
          });
          
          res.status(201).json({
            success: true,
            user: {
              id: result.insertedId,
              email: newUser.email,
              name: newUser.name
            },
            token
          });
        } catch (error) {
          console.error("Error detallado:", error);
          res.status(500).json({
            success: false,
            message: 'Error del servidor',
            details: error instanceof Error ? error.message : String(error)
          });
        }
      });
      
      // ===== RUTAS DE TAREAS =====
      
      // Ruta para obtener todas las tareas
      server.get('/api/tasks/alltask', async (req: any, res: { json: (arg0: { success: boolean; message: string; allTask: any; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: string; details: string; }): void; new(): any; }; }; }) => {
        try {
          console.log("Obteniendo tareas");
          const allTasks = await tasksCollection.find({}).toArray();
          
          res.json({
            success: true,
            message: 'Obteniendo tareas correctamente',
            allTask: allTasks
          });
        } catch (error) {
          console.error("Error Obteniendo tareas:", error);
          res.status(500).json({
            success: false,
            message: 'Error Obteniendo tareas',
            details: error instanceof Error ? error.message : 'Error desconocido'
          });
        }
      });
      
      // Ruta para crear una nueva tarea
      server.post('/api/tasks/newtask', async (req: { body: { title: any; description: any; userId: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: string; taskId?: any; task?: { title: any; description: any; status: string; createdAt: Date; userId: any; subTasks: never[]; comments: never[]; }; details?: string; }): void; new(): any; }; }; }) => {
        try {
          console.log("Recibiendo solicitud para crear nueva tarea");
          const { title, description, userId } = req.body;
          
          if (!title) {
            return res.status(400).json({
              success: false,
              message: 'El título es obligatorio'
            });
          }
          
          const newTask = {
            title: title.trim(),
            description: description?.trim() || '',
            status: 'pendiente',
            createdAt: new Date(),
            userId: userId || '',
            subTasks: [],
            comments: []
          };
          
          const result = await tasksCollection.insertOne(newTask);
          
          res.status(201).json({
            success: true,
            message: 'Tarea creada correctamente',
            taskId: result.insertedId,
            task: newTask
          });
        } catch (error) {
          console.error("Error al crear tarea:", error);
          res.status(500).json({
            success: false,
            message: 'Error al crear la tarea',
            details: error instanceof Error ? error.message : 'Error desconocido'
          });
        }
      });
      
      // Ruta para actualizar una tarea
      server.put('/api/tasks/updatetask', async (req: { body: { taskId: any; update: any; newSubTask: any; newComment: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: string; details?: string; }): void; new(): any; }; }; json: (arg0: { success: boolean; message: string; result: any; }) => void; }) => {
        try {
          console.log("Recibiendo solicitud para actualizar tarea");
          const { taskId, update, newSubTask, newComment } = req.body;
          
          if (!taskId) {
            return res.status(400).json({
              success: false,
              message: 'El ID de la tarea es obligatorio'
            });
          }
          
          let result;
          
          if (update) {
            // Si la actualización incluye subtareas
            if (update.subTasks && update.subTasks.length > 0) {
              
              const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });
              
              if (!task) {
                return res.status(404).json({
                  success: false,
                  message: 'Tarea no encontrada'
                });
              }
              
              // Actualizar la subtarea específica
              const subTaskToUpdate = update.subTasks[0];
              
              if (!task.subTasks) {
                task.subTasks = [];
              }
              
              // Encontrar y actualizar la subtarea
              const updatedSubTasks = task.subTasks.map((subTask: { id: any; title: any; }) => {
                if (subTask.id === subTaskToUpdate.id) {
                  return {
                    ...subTask,
                    status: subTaskToUpdate.status,
                    title: subTaskToUpdate.title || subTask.title,
                    updatedAt: new Date()
                  };
                }
                return subTask;
              });
              
              // Actualizar la tarea con las subtareas actualizadas
              result = await tasksCollection.updateOne(
                { _id: new ObjectId(taskId) },
                { $set: {
                  subTasks: updatedSubTasks,
                  updatedAt: new Date()
                }}
              );
            }
            
            else if (update.status === 'completada') {
              
              const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });
              
              if (task && task.subTasks && task.subTasks.length > 0) {
                
                const pendingSubTasks = task.subTasks.filter(
                  (subTask: { status: string; }) => subTask.status === 'pendiente'
                );
                
                if (pendingSubTasks.length > 0) {
                  return res.status(400).json({
                    success: false,
                    message: 'No se puede marcar la tarea como completada porque tiene subtareas pendientes'
                  });
                }
              }
              
              result = await tasksCollection.updateOne(
                { _id: new ObjectId(taskId) },
                { $set: {
                  ...update,
                  updatedAt: new Date()
                }}
              );
            }
            // Actualización normal
            else {
              if (update.removeSubTask) {
                console.log('Eliminando subtarea:', update.removeSubTask);
                const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });
                
                if (!task) {
                  return res.status(404).json({
                    success: false,
                    message: 'Tarea no encontrada'
                  });
                }
                
                if (!task.subTasks) {
                  task.subTasks = [];
                }
                
                
                const updatedSubTasks = task.subTasks.filter((subTask: { id: any; }) =>
                  subTask.id !== update.removeSubTask
                );
                
                console.log('Subtareas actualizadas:', updatedSubTasks);
                
                
                result = await tasksCollection.updateOne(
                  { _id: new ObjectId(taskId) },
                  { $set: {
                    subTasks: updatedSubTasks,
                    updatedAt: new Date()
                  }}
                );
              } else {
                result = await tasksCollection.updateOne(
                  { _id: new ObjectId(taskId) },
                  { $set: {
                    ...update,
                    updatedAt: new Date()
                  }}
                );
              }
            }
          }
          
          // Si se proporciona una nueva subtarea
          if (newSubTask) {
            const newSubTaskObj = {
              id: new ObjectId().toString(),
              title: newSubTask.title,
              description: newSubTask.description,
              status: 'pendiente',
              createdAt: new Date(),
              taskId: taskId
            };
            
            result = await tasksCollection.updateOne(
              { _id: new ObjectId(taskId) },
              {
                $push: { subTasks: newSubTaskObj },
                $set: { updatedAt: new Date() }
              }
            );
          }
          
          // Si se proporciona un nuevo comentario
          if (newComment) {
            const newCommentObj = {
              id: new ObjectId().toString(),
              content: newComment.content,
              userId: newComment.userId,
              createdAt: new Date()
            };
            
            result = await tasksCollection.updateOne(
              { _id: new ObjectId(taskId) },
              {
                $push: { comments: newCommentObj },
                $set: { updatedAt: new Date() }
              }
            );
          }
          
          if (!result) {
            return res.status(400).json({
              success: false,
              message: 'No se proporcionaron datos para actualizar'
            });
          }
          
          res.json({
            success: true,
            message: 'Tarea actualizada correctamente',
            result
          });
        } catch (error) {
          console.error("Error al actualizar tarea:", error);
          res.status(500).json({
            success: false,
            message: 'Error al actualizar la tarea',
            details: error instanceof Error ? error.message : 'Error desconocido'
          });
        }
      });
      
      // Ruta para eliminar una tarea
      server.delete('/api/tasks/deleteTask', async (req: { body: { taskId: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: string; details?: string; }): void; new(): any; }; }; json: (arg0: { success: boolean; message: string; }) => void; }) => {
        try {
          console.log("Eliminando tarea");
          const { taskId } = req.body;
          
          if (!taskId) {
            return res.status(400).json({
              success: false,
              message: 'ID de tarea no proporcionado'
            });
          }
          
          const result = await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });
          
          if (result.deletedCount === 0) {
            return res.status(404).json({
              success: false,
              message: 'No se encontró la tarea para eliminar'
            });
          }
          
          res.json({
            success: true,
            message: 'Tarea eliminada correctamente'
          });
        } catch (error) {
          console.error("Error eliminando tarea:", error);
          res.status(500).json({
            success: false,
            message: 'Error eliminando tarea',
            details: error instanceof Error ? error.message : 'Error desconocido'
          });
        }
      });
      
    }

    // Iniciar el servidor
    server.listen(port, () => {
      console.log(`> Servidor Express listo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();