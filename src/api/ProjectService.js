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