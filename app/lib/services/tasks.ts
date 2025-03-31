// URL base del servidor Express
const API_BASE_URL = process.env.SERVER_URL || '';


export async function addNewTask(title: string, description: string, userId:string) {
  try {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, userId}),
    };

    const response = await fetch(`${API_BASE_URL}/api/tasks/newtask`, options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.statusText}`;
      console.log('Mensaje de error recibido:', errorMessage);
      throw new Error(errorMessage);
    }
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function addSubTask(taskId: string, title:string) {
    if (!taskId || !title.trim()) return;
    
    try {
      const options: RequestInit = {
        method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                taskId,
                newSubTask: {
                    title: title.trim(),
                    status: 'pendiente'
                }
            }),
      };
        const response = await fetch(`${API_BASE_URL}/api/tasks/updatetask`,options);
        const responseData = await response.json();

        if (!response.ok) {
          const errorMessage = responseData.message || `Error: ${response.statusText}`;
          console.log('Error al agregar subtarea', errorMessage);
          throw new Error(errorMessage);
        }
        return responseData;
    } catch (error) {
        console.error('Error al agregar subtarea:', error);
    }
};

export async function addComment(taskId: string | undefined, content: string, userId: string | undefined) {
  if (!taskId || !content.trim() || !userId) return;
  
  try {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          taskId,
          newComment: {
              content: content.trim(),
              userId
          }
      }),
    };
      const response = await fetch(`${API_BASE_URL}/api/tasks/updatetask`,options);
      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.message || `Error: ${response.statusText}`;
        console.log('Error al agregar comentario', errorMessage);
        throw new Error(errorMessage);
      }
      return responseData;
  } catch (error) {
      console.error('Error al agregar comentario:', error);
  }
};

export async function allTask() {
  try {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${API_BASE_URL}/api/tasks/alltask`, options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.statusText}`;
      console.log('Mensaje de error recibido:', errorMessage);
      throw new Error(errorMessage);
    }
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function changetaskStatusChange(taskId: string | undefined, currentStatus: 'pendiente' | 'completada' | undefined) {
  
  const newStatus = currentStatus === 'pendiente' ? 'completada' : 'pendiente';
  try {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          taskId,
          update: {
              status: newStatus
          }
      }),
    };

    const response = await fetch(`${API_BASE_URL}/api/tasks/updatetask`, options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.statusText}`;
      console.log('Error al actualizar estado de tarea:', errorMessage);
      throw new Error(errorMessage);
    }
    return responseData;
  } catch (error) {
    console.error('Error al actualizar estado de tarea:', error);
    throw error;
  }
}


export async function changetaSubTaskStatus(taskId: string | undefined, subTaskId: string, currentStatus: 'pendiente' | 'completada') {
  
  const newStatus = currentStatus === 'pendiente' ? 'completada' : 'pendiente';
  try {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          taskId,
          update: {
              subTasks: [{
                  id: subTaskId,
                  status: newStatus
              }]
          }
      }),
    };

    const response = await fetch(`${API_BASE_URL}/api/tasks/updatetask`, options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.statusText}`;
      console.log('Error al actualizar estado de tarea:', errorMessage);
      throw new Error(errorMessage);
    }
    return responseData;
  } catch (error) {
    console.error('Error al actualizar estado de tarea:', error);
    throw error;
  }
}

export async function deleteTask(taskId: string) {
  if (!taskId) return;
  
  try {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId }),
    };

    const response = await fetch(`${API_BASE_URL}/api/tasks/deleteTask`, options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.statusText}`;
      console.log('Error al eliminar tarea:', errorMessage);
      throw new Error(errorMessage);
    }
    return responseData;
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    throw error;
  }
}

export async function deleteSubTask(taskId: string, subTaskId: string) {
  if (!taskId || !subTaskId) return;
  
  try {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId,
        update: {
          removeSubTask: subTaskId
        }
      }),
    };

    const response = await fetch(`${API_BASE_URL}/api/tasks/updatetask`, options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.statusText}`;
      console.log('Error al eliminar subtarea:', errorMessage);
      throw new Error(errorMessage);
    }
    return responseData;
  } catch (error) {
    console.error('Error al eliminar subtarea:', error);
    throw error;
  }
}

export async function editSubTask(taskId: string, subTaskId: string, title: string, currentStatus: 'pendiente' | 'completada') {
  if (!taskId || !subTaskId || !title.trim()) return;
  
  try {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId,
        update: {
          subTasks: [{
            id: subTaskId,
            status: currentStatus,
            title: title.trim()
          }]
        }
      }),
    };

    const response = await fetch(`${API_BASE_URL}/api/tasks/updatetask`, options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.statusText}`;
      console.log('Error al editar subtarea:', errorMessage);
      throw new Error(errorMessage);
    }
    return responseData;
  } catch (error) {
    console.error('Error al editar subtarea:', error);
    throw error;
  }
}

export async function editTask(taskId: string, title: string, description: string) {
  if (!taskId || !title.trim() || !description.trim()) return;
  
  try {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId,
        update: {
          title: title.trim(),
          description: description.trim()
        }
      }),
    };

    const response = await fetch(`${API_BASE_URL}/api/tasks/updatetask`, options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.statusText}`;
      console.log('Error al editar tarea:', errorMessage);
      throw new Error(errorMessage);
    }
    return responseData;
  } catch (error) {
    console.error('Error al editar tarea:', error);
    throw error;
  }
}