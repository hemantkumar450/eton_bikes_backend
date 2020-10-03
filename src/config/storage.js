const storage = {
    defaultStorage: process.env.DEFAULT_STORAGE || 'local',
    local: {
        path: {
            media: 'files',
            document: 'files'
        }
    },
    maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024 * 10
};

export default storage;