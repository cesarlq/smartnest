
export async function addNewTask(title: string, description: string, userId:string) {
  try {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, userId}),
    };

    const response = await fetch('/api/tasks/newtask', options);
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
        const response = await fetch('/api/tasks/updatetask',options);
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
      const response = await fetch('/api/tasks/updatetask',options);
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

    const response = await fetch('/api/tasks/alltask', options);
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

    const response = await fetch('/api/tasks/updatetask', options);
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

    const response = await fetch('/api/tasks/updatetask', options);
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