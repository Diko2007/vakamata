
import { useState } from "react";
import "./App.css";

// Дочерний компонент кнопки вкладки
function TabButton({ title, active, onClick }) {
  return (
    <button
      className={active ? "tab active" : "tab"}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

// Основной компонент
function App() {
  const [activeTab, setActiveTab] = useState("Главная");

  return (
    <div className="container">
      <h1>Учебная панель</h1>
      <p className="subtitle">
        Лабораторная работа №11 — Вариант 14
      </p>

      <div className="tabs">
        <TabButton
          title="Главная"
          active={activeTab === "Главная"}
          onClick={() => setActiveTab("Главная")}
        />

        <TabButton
          title="Студенты"
          active={activeTab === "Студенты"}
          onClick={() => setActiveTab("Студенты")}
        />

        <TabButton
          title="Расписание"
          active={activeTab === "Расписание"}
          onClick={() => setActiveTab("Расписание")}
        />

        <TabButton
          title="О проекте"
          active={activeTab === "О проекте"}
          onClick={() => setActiveTab("О проекте")}
        />
      </div>

      <div className="content">
        {activeTab === "Главная" && (
          <div>
            <h2>Главная страница</h2>
            <p>Добро пожаловать в учебную панель!</p>
            <p>Здесь можно переключаться между разделами.</p>
          </div>
        )}

        {activeTab === "Студенты" && (
          <div>
            <h2>Список студентов</h2>
            <p>Мухаметов Дияр — ИС 25-22</p>
            <p>Алиев Арман — ИС 25-22</p>
            <p>Серикова Алина — ИС 25-22</p>
          </div>
        )}

        {activeTab === "Расписание" && (
          <div>
            <h2>Расписание занятий</h2>
            <p>Понедельник — Программирование</p>
            <p>Вторник — Базы данных</p>
            <p>Среда — Математика</p>
          </div>
        )}

        {activeTab === "О проекте" && (
          <div>
            <h2>О лабораторной работе</h2>
            <p>Тема: React, Props и State.</p>
            <p>Вариант: 14 — Вкладки.</p>
            <p>Студент: Мухаметов Дияр.</p>
            <p>Группа: ИС 25-22.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
