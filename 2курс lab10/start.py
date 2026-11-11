"""Локальный запуск лабораторной. Внешние пакеты не нужны."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


def main():
    folder = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(folder))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", 8000), handler)
    except OSError:
        print("Порт 8000 занят. Закройте предыдущий сервер или выполните в папке проекта:")
        print("python3 -m http.server 8001 --bind 127.0.0.1")
        print("Затем откройте http://127.0.0.1:8001")
        return 1
    with server:
        print("Лабораторная №10: http://127.0.0.1:8000")
        print("Чтобы остановить сервер, нажмите Ctrl+C.")
        try:
            webbrowser.open("http://127.0.0.1:8000")
        except webbrowser.Error:
            print("Откройте адрес вручную в браузере.")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nСервер остановлен.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
