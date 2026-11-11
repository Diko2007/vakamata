// Хранение данных вынесено из моделей и DOM-интерфейса.
export function createStorage(key, adapter) {
  let lastError = '';
  const getBackend = () => adapter === undefined ? globalThis.localStorage : adapter;

  return {
    load(fallback) {
      lastError = '';
      try {
        const raw = getBackend().getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        lastError = 'Не удалось прочитать сохранённые данные. Начат пустой список; работа в этой вкладке доступна.';
        return fallback;
      }
    },
    save(value) {
      lastError = '';
      try {
        getBackend().setItem(key, JSON.stringify(value));
        return true;
      } catch {
        lastError = 'Не удалось сохранить данные в браузере. Изменения доступны только до закрытия или обновления этой вкладки.';
        return false;
      }
    },
    clear() {
      lastError = '';
      try {
        getBackend().removeItem(key);
        return true;
      } catch {
        lastError = 'Не удалось очистить сохранённые данные.';
        return false;
      }
    },
    getLastError() {
      return lastError;
    }
  };
}
