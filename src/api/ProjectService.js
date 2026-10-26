const APP_API = "http://localhost:5001/api/projects";

export const GetProject = async () => {
    try {
        const response = await fetch(APP_API);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Gagal mengambil project:", error);
        throw error;
    }
};

export const CreateProject = async (NewProject) => {
    const response = await fetch(APP_API, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...NewProject,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal membuat project');
    }

    return response.json();
};

export const DeleteProject = async (id) => {
    try {
        const response = await fetch(`${APP_API}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Gagal menghapus project:", error);
        throw error;
    }
};

export const UpdateProject = async (id, updatedProject) => {
    try {
        const response = await fetch(`${APP_API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProject)
        });
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Gagal memperbarui project:", error);
        throw error;
    }
};


