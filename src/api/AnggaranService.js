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

export const CreateAnggaran = async (NewAnggaran) => {
    try {
        const response = await fetch(APP_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...NewAnggaran,
                RencanaAnggaran: Number(NewAnggaran.RencanaAnggaran || 0),
                Realisasi: Number(NewAnggaran.Realisasi || 0),
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Gagal membuat anggaran:", error);
        throw error;
    }
};


export const DeleteAnggaran = async (id) => {
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
        console.error("Gagal menghapus anggaran:", error);
        throw error;
    }
};

export const UpdateAnggaran = async (id, updatedAnggaran) => {
    try {
        const response = await fetch(`${APP_API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedAnggaran)
        });
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Gagal memperbarui anggaran:", error);
        throw error;
    }
};