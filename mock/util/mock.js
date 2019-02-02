export function createdAt() {
    return {
        createdAt: new Date().getTime(),
        creator: null,
    };
}

export function updatedAt() {
    return {
        updatedAt: new Date().getTime(),
        updater: null,
    };
}

export function deletedAt() {
    return {
        deletedAt: new Date().getTime(),
        deleter: null,
    };
}
