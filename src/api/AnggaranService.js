const APP_API = "http://localhost:5001/api/anggaran";

export const GetAnggaran = async () => {
     try {
        const response = await fetch(APP_API);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Gagal mengambil anggaran:", error);
        throw error;
    }
};