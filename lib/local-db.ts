// Open the IndexedDB database
function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("BibleStorage", 1);

        request.onerror = () => reject("Error opening IndexedDB");
        request.onsuccess = () => resolve(request.result);

        // This event only runs if the DB is opened for the first time or if its version is upgraded
        request.onupgradeneeded = (event) => {
            const db = request.result;
            if (!db.objectStoreNames.contains("bibleData")) {
                db.createObjectStore("bibleData", { keyPath: "id" });
            }
        };
    });
}

// Set data into IndexedDB
export async function setData(key: string, data: any) {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(["bibleData"], "readwrite");
        const store = transaction.objectStore("bibleData");
        store.put({ id: key, value: JSON.stringify(data) });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => reject("Failed to store data");
        });
    } catch (error) {
        console.error("Error setting data in IndexedDB:", error);
    }
}

// Get data from IndexedDB
export async function getData(key: string): Promise<any | null> {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(["bibleData"], "readonly");
        const store = transaction.objectStore("bibleData");
        const request = store.get(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(
                    JSON.parse(request.result ? request.result.value : null),
                );
            };
            request.onerror = () => reject("Failed to retrieve data");
        });
    } catch (error) {
        console.error("Error getting data from IndexedDB:", error);
        return null;
    }
}
