
# Gurudo

Gurudo to innowacyjna aplikacja do zarządzania czasem pracy, inspirowana postacią Gurudo z Dragon Ball Z, który posiada unikalną zdolność zatrzymywania czasu podczas walki. Aplikacja ma na celu wspomaganie pracodawców i pracowników w efektywnym zarządzaniu sesjami pracy, śledzeniu czasu oraz zwiększaniu produktywności w miejscu pracy.

---

## Spis treści
- [Gurudo](#gurudo)
  - [Spis treści](#spis-treści)
  - [Wprowadzenie](#wprowadzenie)
  - [Wymagania systemowe](#wymagania-systemowe)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Inne narzędzia](#inne-narzędzia)
    - [Narzędzia deweloperskie](#narzędzia-deweloperskie)
    - [Konfiguracja systemowa](#konfiguracja-systemowa)
  - [Instrukcja instalacji](#instrukcja-instalacji)
    - [Kroki do sklonowania repozytorium](#kroki-do-sklonowania-repozytorium)
    - [Ustawienia backendowe](#ustawienia-backendowe)
      - [Konfiguracja CORS w Django](#konfiguracja-cors-w-django)
    - [Ustawienia frontendowe](#ustawienia-frontendowe)
      - [Konfiguracja baseURL w pliku api.js](#konfiguracja-baseurl-w-pliku-apijs)
    - [Instrukcje dotyczące instalacji zależności backendu (Django)](#instrukcje-dotyczące-instalacji-zależności-backendu-django)
    - [Instrukcje dotyczące instalacji zależności frontendowych (React)](#instrukcje-dotyczące-instalacji-zależności-frontendowych-react)
    - [Uruchamianie serwera backendowego](#uruchamianie-serwera-backendowego)
    - [Uruchamianie aplikacji frontendowej](#uruchamianie-aplikacji-frontendowej)
  - [Użycie](#użycie)
    - [Kroki do zalogowania się i rozpoczęcia pracy z aplikacją](#kroki-do-zalogowania-się-i-rozpoczęcia-pracy-z-aplikacją)
    - [Przykłady głównych funkcji aplikacji](#przykłady-głównych-funkcji-aplikacji)
      - [Interfejs Pracownika](#interfejs-pracownika)
      - [Interfejs Pracodawcy](#interfejs-pracodawcy)
      - [Dodawanie pracowników](#dodawanie-pracowników)
      - [Rejestrowanie sesji pracy](#rejestrowanie-sesji-pracy)
      - [Przeglądanie i edytowanie sesji pracy](#przeglądanie-i-edytowanie-sesji-pracy)
      - [Generowanie raportów miesięcznych](#generowanie-raportów-miesięcznych)
      - [Zarządzanie miejscami pracy](#zarządzanie-miejscami-pracy)
      - [Podsumowanie](#podsumowanie)
  - [Funkcje aplikacji](#funkcje-aplikacji)
    - [Zarządzanie pracownikami](#zarządzanie-pracownikami)
    - [Zarządzanie miejscami pracy](#zarządzanie-miejscami-pracy)
    - [Rejestrowanie sesji pracy](#rejestrowanie-sesji-pracy)
    - [Generowanie raportów](#generowanie-raportów)
    - [Przegląd sesji według dnia](#przegląd-sesji-według-dnia)
    - [Przegląd sesji według miesiąca](#przegląd-sesji-według-miesiąca)
    - [Zarządzanie uprawnieniami użytkowników](#zarządzanie-uprawnieniami-użytkowników)
    - [Intuicyjny interfejs](#intuicyjny-interfejs)
    - [Alerty dotyczące nieprawidłowych działań](#alerty-dotyczące-nieprawidłowych-działań)
    - [Integracja z zewnętrznymi narzędziami](#integracja-z-zewnętrznymi-narzędziami)
  - [Przykładowe obrazy/screenshoty](#przykładowe-obrazy-screenshoty)
  - [Dokumentacja API](#dokumentacja-api)
    - [Endpointy](#endpointy)
      - [Główny Endpoint](#główny-endpoint)
      - [Admin](#admin)
      - [Autoryzacja API](#autoryzacja-api)
      - [Profile](#profile)
      - [Miejsca Pracy](#miejsca-pracy)
      - [Sesje Pracy](#sesje-pracy)
      - [Aktywne Sesje](#aktywne-sesje)
      - [Pracownicy](#pracownicy)
      - [Token JWT](#token-jwt)
      - [Rejestracja Użytkownika](#rejestracja-użytkownika)
      - [Resetowanie Hasła](#resetowanie-hasła)
      - [Konta](#konta)
  - [Konfiguracja](#konfiguracja)
    - [Ustawienia backendowe](#ustawienia-backendowe)
      - [Konfiguracja CORS w Django](#konfiguracja-cors-w-django)
    - [Ustawienia frontendowe](#ustawienia-frontendowe)
      - [Konfiguracja baseURL w pliku api.js](#konfiguracja-baseurl-w-pliku-apijs)
  - [Przykładowe komponenty kodu](#przykładowe-komponenty-kodu)
    - [EmployeeDetailsByDay.tsx](#employeedetailsbydaytsx)
  - [Zarządzanie błędami](#zarządzanie-błędami)
    - [Jak obsługiwać błędy w aplikacji](#jak-obsługiwać-błędy-w-aplikacji)
      - [Wyświetlanie komunikatów o błędach](#wyświetlanie-komunikatów-o-błędach)
      - [Obsługa błędów sieciowych](#obsługa-błędów-sieciowych)
  - [Zarządzanie sesjami pracy](#zarządzanie-sesjami-pracy)
    - [Jak aplikacja radzi sobie z sesjami pracy](#jak-aplikacja-radzi-sobie-z-sesjami-pracy)
      - [Aktualne sesje pracy](#aktualne-sesje-pracy)
      - [Usuwanie miejsc pracy, gdy są aktywne sesje](#usuwanie-miejsc-pracy-gdy-są-aktywne-sesje)
      - [Monitorowanie aktywności pracowników](#monitorowanie-aktywności-pracowników)
  - [Testy manualne](#testy-manualne)
  - [Informacje o autorze](#informacje-o-autorze)
  - [Licencja](#licencja)
  - [Podziękowania](#podziękowania)

  

---

## Wprowadzenie

Gurudo to nowoczesna aplikacja stworzona w celu ułatwienia zarządzania czasem pracy. Aplikacja została zainspirowana postacią Gurudo z Dragon Ball, który posiada zdolność zatrzymywania czasu, co symbolizuje kontrolę i efektywne zarządzanie czasem. 

Gurudo jest narzędziem przeznaczonym zarówno dla pracodawców, jak i pracowników. Umożliwia śledzenie godzin pracy, zarządzanie miejscami pracy oraz monitorowanie sesji pracy w czasie rzeczywistym. Aplikacja została zaprojektowana z myślą o łatwości użycia i intuicyjnym interfejsie, aby maksymalnie usprawnić procesy zarządzania czasem pracy.

Wprowadzenie do Gurudo zawiera:
- Krótką historię powstania projektu
- Cel i misję aplikacji
- Kluczowe funkcje i możliwości
- Korzyści płynące z użytkowania aplikacji

Celem Gurudo jest dostarczenie kompleksowego rozwiązania do zarządzania czasem pracy, które zwiększa efektywność, poprawia organizację i wspiera lepsze zarządzanie zasobami ludzkimi w każdej organizacji.

---

## Wymagania systemowe

Aby uruchomić i korzystać z aplikacji Gurudo, należy spełnić następujące wymagania systemowe:

### Backend
**Python**
  - Wersja: 3.8 lub nowsza
  - Python jest podstawowym językiem programowania używanym do budowy backendu aplikacji.

**Django**
  - Wersja: 3.2 lub nowsza
  - Django jest głównym frameworkiem webowym używanym do tworzenia backendu aplikacji Gurudo.

**Django REST Framework**
  - Wersja: 3.12 lub nowsza
  - Używany do budowy API, które komunikuje się z frontendem.

**djangorestframework-simplejwt**
  - Używany do zarządzania autoryzacją i autentykacją JWT.

**cloudinary**
  - Wersja: 1.25.0 lub nowsza
  - Używana do przechowywania i zarządzania plikami multimedialnymi w aplikacji.

**dj-database-url**
  - Używany do konfiguracji połączenia z bazą danych.

### Frontend
**Node.js**
  - Wersja: 14.x lub nowsza
  - Node.js jest środowiskiem uruchomieniowym JavaScript, które jest wymagane do uruchomienia narzędzi buildowania i zarządzania pakietami frontendowymi.

**npm (Node Package Manager)**
  - Wersja: 6.x lub nowsza
  - npm jest używany do zarządzania pakietami JavaScript i bibliotekami frontendowymi.

**React**
  - Wersja: 18.2.0 lub nowsza
  - React jest biblioteką JavaScript używaną do budowy interfejsu użytkownika.

**React Bootstrap**
  - Wersja: 2.10.2 lub nowsza
  - Używany do stylizacji komponentów frontendowych.

**React Router**
  - Wersja: 6.22.3 lub nowsza
  - Używany do zarządzania routami w aplikacji frontendowej.

**Vite**
  - Wersja: 5.2.0 lub nowsza
  - Używany jako narzędzie do buildowania i uruchamiania aplikacji frontendowej.

### Inne narzędzia
**PostgreSQL**
  - Wersja: 12.x lub nowsza
  - PostgreSQL jest rekomendowaną bazą danych do przechowywania danych aplikacji.

**Docker (opcjonalnie)**
  - Używany do konteneryzacji aplikacji, co ułatwia jej wdrożenie i zarządzanie środowiskami.

### Narzędzia deweloperskie
**Visual Studio Code**
  - Wersja: najnowsza
  - Edytor kodu rekomendowany do pracy nad projektem.

**Git**
  - Wersja: najnowsza
  - System kontroli wersji używany do zarządzania kodem źródłowym projektu.

**Chrome DevTools / Safari DevTools**
  - Narzędzia do debugowania frontendowej części aplikacji.

### Konfiguracja systemowa
**System operacyjny**
  - Linux, macOS, Windows (najlepiej z zainstalowanym WSL2 dla Windows)

**Przeglądarka internetowa**
  - Google Chrome, Mozilla Firefox, Safari (najnowsza wersja)

Zapewnienie zgodności z powyższymi wymaganiami systemowymi umożliwi prawidłowe uruchomienie i korzystanie z aplikacji Gurudo.

---

## Instrukcja instalacji

### Kroki do sklonowania repozytorium
1. Otwórz terminal lub wiersz poleceń.
2. Przejdź do katalogu, w którym chcesz sklonować repozytorium.
3. Wykonaj poniższe polecenie, aby sklonować repozytorium (frontend):
   ```bash
   git clone https://github.com/lukaszglowacz/bygg-app-front-react.git
4. Przejdź do katalogu projektu:
   ```bash
   cd bygg-app-front-react
5. Wykonaj poniższe polecenie, aby sklonować repozytorium (backend):
   ```bash
   git clone https://github.com/lukaszglowacz/bygg-drf-api.git
6. Przejdź do katalogu projektu:
   ```bash
   cd bygg-drf-api
### Instrukcje dotyczące instalacji zależności backendu (Django)
1. Upewnij się, że masz zainstalowanego Pythona w wersji 3.8 lub nowszej.
2. Zainstaluj wirtualne środowisko (venv):
   ```bash
   python -m venv venv
3. Aktywuj wirtualne środowisko:
   - Na systemie Windows:
     ```bash
     venv\Scripts\activate
   - Na systemie macOS/Linux:
     ```bash
     source venv/bin/activate
4. Zainstaluj zależności backendu z pliku `requirements.txt`:
   ```bash
   pip install -r requirements.txt
### Instrukcje dotyczące instalacji zależności frontendowych (React)
1. Upewnij się, że masz zainstalowanego Node.js w wersji 14.x lub nowszej oraz npm w wersji 6.x lub nowszej.
2. Przejdź do katalogu frontendowego:
   ```bash
   cd bygg-app-front-react
3. Zainstaluj zależności frontendowe:
   ```bash
   npm install
### Uruchamianie serwera backendowego
1. Upewnij się, że wirtualne środowisko jest aktywowane.
2. Wykonaj migracje bazy danych:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
3. Uruchom serwer Django:
    ```bash
    python manage.py runserver
  Powinieneś zobaczyć komunikat informujący o uruchomieniu serwera na `http://127.0.0.1:8000/`

### Uruchamianie aplikacji frontendowej
1. Upewnij się, że jesteś w katalogu frontendowym:
   ```bash
   cd bygg-app-front-react
2. Uruchom serwer deweloperski:
   ```bash
   npm run dev
  Powinieneś zobaczyć komunikat informujący o uruchomieniu aplikacji na `http://localhost:3000/`.



---

## Użycie
### Przykłady głównych funkcji aplikacji

Interfejs dla pracownika i pracodawcy różni się w zależności od uprawnień użytkownika.

#### Interfejs Pracownika
1. Pracownik ma możliwość rejestrowania swojego czasu pracy poprzez przyciski "Start" i "End".
2. Pracownik może przeglądać swoje sesje pracy, zestawienia godzin oraz historyczne dane dotyczące sesji pracy.
3. Wyświetlana jest suma przepracowanych godzin oraz podstawowe informacje potrzebne do monitorowania czasu pracy w danym okresie.
4. Pracownik ma możliwość edycji swoich danych osobowych, zmiany hasła oraz trwałego usunięcia swojego konta.

#### Interfejs Pracodawcy
1. Gurudo
   1. Spis treści
   2. Wprowadzenie
   3. Wymagania systemowe
      1. Backend
      2. Frontend
      3. Inne narzędzia
      4. Narzędzia deweloperskie
      5. Konfiguracja systemowa
   4. Instrukcja instalacji
      1. Kroki do sklonowania repozytorium
      2. Ustawienia frontendowe
         1. Konfiguracja baseURL w pliku api.js
   5. Przykładowe komponenty kodu
      1. EmployeeDetailsByDay.tsx
   6. Zarządzanie błędami
      1. Jak obsługiwać błędy w aplikacji
         1. Wyświetlanie komunikatów o błędach
         2. Obsługa błędów sieciowych
   7. Zarządzanie sesjami pracy
      1. Jak aplikacja radzi sobie z sesjami pracy
         1. Aktualne sesje pracy
         2. Usuwanie miejsc pracy, gdy są aktywne sesje
         3. Monitorowanie aktywności pracowników
   8. Testy manualne
      1. Błędy w aplikacji - Wykonane poprawki
      2. Błędy aplikacji do zrobienia w przyszłości
   9. Informacje o autorze
   10. Licencja
   11. Podziękowania

#### Dodawanie pracowników
Pracownik otrzymuje automatycznie uprawnienia pracownika podczas rejestracji do aplikacji. Aby się zarejestrować, wykonaj następujące kroki:

1. Kliknij przycisk "Sign Up here" w oknie logowania.
2. Podaj niezbędne dane (email, hasło, imię, nazwisko, personnummer).
3. Kliknij przycisk "Sign Up".
4. Zostaniesz przekierowany do okna logowania.
5. Uzupełnij formularz logowania danymi z formularza rejestracji i zaloguj się do aplikacji.

#### Rejestrowanie sesji pracy

1. Na stronie głównej wybierz miejsce pracy z rozwijanej listy, klikając ikonę budynku.
2. Gdy jesteś w miejscu pracy i rozpoczynasz pracę, kliknij "Start".
3. Gdy kończysz pracę, kliknij "End".

#### Przeglądanie i edytowanie sesji pracy

1. Przejdź do sekcji "Team Management" w menu nawigacyjnym.
2. Wybierz pracownika.
3. Kliknij na przycisk "Show Hours".
4. Przejdziesz do sekcji widoku miesięcznego sesji pracy pracownika.
5. Znajdź miesiąc i dzień sesji, którą chcesz edytować.
6. Kliknij na przycisk "ArrowRight" po prawej stronie ekranu przy dacie, w której znajduje się sesja pracy.
7. Przejdziesz do sekcji widoku dnia z sesjami pracy.
8. Kliknij na przycisk "Edit".
9. Uzupełnij formularz nowymi danymi.
10. Kliknij na przycisk "Save".

#### Generowanie raportów miesięcznych

1. Przejdź do sekcji "Team Management" w menu nawigacyjnym.
2. Wybierz pracownika.
3. Kliknij na przycisk "Show Hours".
4. Przejdziesz do sekcji widoku miesięcznego sesji pracy pracownika.
5. Kliknij na przycisk "Download".
6. Zostanie wygenerowany plik PDF z miesięcznym zestawieniem wybranego pracownika za wybrany przez Ciebie miesiąc.
   
#### Zarządzanie miejscami pracy

1. Przejdź do sekcji "Locations" w menu nawigacyjnym.
2. Kliknij przycisk "Add".
3. Wypełnij formularz dodawania miejsca pracy, podając szczegółowe informacje takie jak ulica, numer ulicy, kod pocztowy, miasto.
4. Kliknij przycisk "Save", aby dodać nowe miejsce pracy.
5. Pracownicy będą mogli teraz wybrać to miejsce pracy z rozwijanego menu.
6. Aby edytować miejsce pracy, kliknij przycisk "Edit" i wprowadź niezbędne zmiany.
7. Aby usunąć miejsce pracy, kliknij przycisk "Delete" i potwierdź usunięcie.

### Podsumowanie

Aplikacja Gurudo oferuje szereg funkcji ułatwiających zarządzanie czasem pracy i miejscami pracy. Dzięki intuicyjnemu interfejsowi użytkownika i zaawansowanym funkcjom, pracodawcy i pracownicy mogą efektywnie zarządzać swoimi obowiązkami i czasem pracy.

Zapewniamy, że przestrzeganie powyższych kroków pomoże w pełnym wykorzystaniu możliwości aplikacji Gurudo.

---

## Funkcje aplikacji

#### Zarządzanie pracownikami
- Możliwość dodawania, edytowania i usuwania pracowników.
- Przegląd i zarządzanie danymi pracowników, w tym historią ich sesji pracy.

#### Zarządzanie miejscami pracy
- Dodawanie, edytowanie i usuwanie miejsc pracy.
- Przegląd dostępnych miejsc pracy i przypisywanie ich do sesji pracy pracowników.

#### Rejestrowanie sesji pracy
- Rozpoczynanie i kończenie sesji pracy przez pracowników.
- Monitorowanie aktywnych sesji pracy w czasie rzeczywistym.
- Dodawanie, edytowanie i usuwanie sesji pracy pracowników przez pracodawcę.

#### Generowanie raportów
- Tworzenie raportów z sesji pracy pracowników.
- Generowanie zestawień miesięcznych aktywności pracowników w formacie PDF.

#### Przegląd sesji według dnia
- Przegląd sesji pracy pracowników według wybranego dnia.
- Szczegółowe informacje o czasie rozpoczęcia, zakończenia oraz całkowitym czasie pracy.

#### Przegląd sesji według miesiąca
- Przegląd sesji pracy pracowników według wybranego miesiąca.
- Podsumowanie całkowitego czasu pracy dla każdego dnia w miesiącu.

#### Zarządzanie uprawnieniami użytkowników
- Możliwość przypisywania ról i uprawnień pracownika i pracodawcy.
- Zarządzanie dostępem do różnych funkcji aplikacji w zależności od roli użytkownika.

#### Intuicyjny interfejs** 
- Wyświetlanie szczegółowych instrukcji w czasie rzeczywistym, ułatwiających nawigację i użytkowanie aplikacji.
  
#### Alerty dotyczące nieprawidłowych działań
- Powiadomienia o błędach, takich jak próba usunięcia miejsca pracy przez pracodawcę, gdy aktualnie pracuje na nim pracownik.

#### Integracja z zewnętrznymi narzędziami
- Możliwość integracji z narzędziami do zarządzania projektami i innymi systemami HR.
- API umożliwiające komunikację z zewnętrznymi aplikacjami.

---

## Przykładowe obrazy/screenshoty



---

## Dokumentacja API

### Endpointy

#### 1. Główny Endpoint
- **URL:** `/`
- **Metoda:** GET
- **Opis:** Ten endpoint jest głównym punktem wejścia do API, zwykle używany do sprawdzenia stanu API.

#### 2. Admin
- **URL:** `/admin/`
- **Metoda:** GET, POST
- **Opis:** Panel administracyjny Django, dostępny tylko dla administratorów. Służy do zarządzania modelami aplikacji.

#### 3. Autoryzacja API
- **URL:** `/api-auth/`
- **Metoda:** GET, POST
- **Opis:** Obsługuje logowanie i wylogowanie użytkowników za pomocą interfejsu REST API.

#### 4. Profile
- **URL:** `/profile/`
- **Metoda:** GET, POST, PUT, DELETE
- **Opis:** Endpoint do zarządzania profilami użytkowników. Obsługuje tworzenie, odczytywanie, aktualizowanie i usuwanie profili.

#### 5. Miejsca Pracy
- **URL:** `/workplace/`
- **Metoda:** GET, POST, PUT, DELETE
- **Opis:** Endpoint do zarządzania miejscami pracy. Obsługuje tworzenie, odczytywanie, aktualizowanie i usuwanie miejsc pracy.

#### 6. Sesje Pracy
- **URL:** `/worksession/`
- **Metoda:** GET, POST, PUT, DELETE
- **Opis:** Endpoint do zarządzania sesjami pracy. Obsługuje tworzenie, odczytywanie, aktualizowanie i usuwanie sesji pracy.

#### 7. Aktywne Sesje
- **URL:** `/livesession/`
- **Metoda:** GET
- **Opis:** Endpoint do odczytywania aktualnie aktywnych sesji pracy. Obsługuje tylko odczytywanie.

#### 8. Pracownicy
- **URL:** `/employee/`
- **Metoda:** GET, POST, PUT, DELETE
- **Opis:** Endpoint do zarządzania pracownikami. Obsługuje tworzenie, odczytywanie, aktualizowanie i usuwanie pracowników.

#### 9. Token JWT
- **URL:** `/api/token/`
- **Metoda:** POST
- **Opis:** Endpoint do uzyskiwania tokenu JWT dla zalogowanego użytkownika.

- **URL:** `/api/token/refresh/`
- **Metoda:** POST
- **Opis:** Endpoint do odświeżania tokenu JWT dla zalogowanego użytkownika.

#### 10. Rejestracja Użytkownika
- **URL:** `/register/`
- **Metoda:** POST
- **Opis:** Endpoint do rejestracji nowego użytkownika.

#### 11. Resetowanie Hasła
- **URL:** `/password-reset/`
- **Metoda:** POST, GET
- **Opis:** Endpoint do resetowania hasła użytkownika. Obsługuje żądanie resetowania hasła oraz potwierdzenie resetowania hasła.

#### 12. Konta
- **URL:** `/accounts/`
- **Metoda:** GET, POST, PUT, DELETE
- **Opis:** Endpoint do zarządzania kontami użytkowników. Obsługuje tworzenie, odczytywanie, aktualizowanie i usuwanie kont.

---

## Konfiguracja

### Ustawienia backendowe

#### Konfiguracja CORS w Django

Aby umożliwić komunikację między frontendem a backendem, należy skonfigurować CORS w pliku `settings.py`:

```python
# settings.py

INSTALLED_APPS = [
    ...,
    'corsheaders',
    ...,
]

MIDDLEWARE = [
    ...,
    'corsheaders.middleware.CorsMiddleware',
    ...,
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'https://worktime-app-api-080c4d35911e.herokuapp.com',
    'https://worktime-app-react-cd9b9f8fb803.herokuapp.com',  
]
``````

### Ustawienia frontendowe
#### Konfiguracja baseURL w pliku api.js
Plik `api.ts` zawiera konfigurację Axios, w tym ustawienie podstawowego URL-a (baseURL) dla żądań HTTP do backendu:

``````jsx

import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://worktime-app-api-080c4d35911e.herokuapp.com", // Ustawienie baseURL dla żądań HTTP do backendu
  headers: {
    "Content-Type": "application/json",
  },
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  retry?: boolean;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.retry
    ) {
      originalRequest.retry = true;
      try {
        const tokenResponse = await axios.post<{ access: string }>("https://worktime-app-api-080c4d35911e.herokuapp.com/api/token/refresh/", {
          refresh: localStorage.getItem("refreshToken")
        });
        if (tokenResponse.data.access) {
          localStorage.setItem("accessToken", tokenResponse.data.access);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${tokenResponse.data.access}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError: any) {
        console.error("Error refreshing token:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

``````

---

## Przykładowe komponenty kodu
W tej sekcji przedstawiamy przykłady kodu dla głównych komponentów aplikacji, które pokazują, jak zbudowane są poszczególne części aplikacji. Komponenty te są kluczowe dla funkcjonowania aplikacji i ilustrują, jak różne technologie i biblioteki są wykorzystywane do realizacji konkretnych funkcji.

### EmployeeDetailsByDay.tsx
Komponent EmployeeDetailsByDay.tsx jest odpowiedzialny za wyświetlanie szczegółowych informacji o sesjach pracy danego pracownika w wybranym dniu przez pracodawcę. Poniżej znajduje się przykładowy kod tego komponentu.

``````jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { WorkSession, Employee } from "../api/interfaces/types";
import {
  Container,
  Row,
  Col,
  Alert,
  ListGroup,
  Button,
  Card,
} from "react-bootstrap";
import {
  House,
  ClockHistory,
  ClockFill,
  HourglassSplit,
  PersonBadge,
  Envelope,
  PersonCircle,
  ChevronLeft,
  ChevronRight,
  PlusSquare,
  PencilSquare,
  Trash,
} from "react-bootstrap-icons";
import { sumTotalTime } from "../utils/timeUtils";
import { formatTime } from "../utils/dateUtils";
import Loader from "./Loader";
import moment from "moment-timezone";
import ConfirmModal from "./ConfirmModal";

const EmployeeDetailsByDay: React.FC = () => {
  const { id, date } = useParams<{ id: string; date?: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [totalTime, setTotalTime] = useState<string>("0 h, 0 min");
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get<Employee>(`/employee/${id}`);
        setEmployee(response.data);
      } catch (err) {
        setError("Error retrieving employee data");
      }
    };

    fetchEmployee();
  }, [id]);

  useEffect(() => {
    if (employee) {
      fetchSessions(employee.work_session, date);
    }
  }, [employee, date]);

  const fetchSessions = (allSessions: WorkSession[], date?: string) => {
    setIsLoadingSessions(true);
    const daySessions = getSessionsForDate(allSessions, date);
    setSessions(daySessions);
    setTotalTime(sumTotalTime(daySessions));
    setIsLoadingSessions(false);
  };

  const getSessionsForDate = (sessions: WorkSession[], date?: string) => {
    if (!date) return [];
    const targetDate = moment.tz(date, "Europe/Stockholm");
    const sessionsForDate: WorkSession[] = [];

    sessions.forEach((session) => {
      const start = moment.utc(session.start_time).tz("Europe/Stockholm");
      const end = moment.utc(session.end_time).tz("Europe/Stockholm");

      let currentStart = start.clone();

      while (currentStart.isBefore(end)) {
        const sessionEndOfDay = currentStart.clone().endOf("day");
        const sessionEnd = end.isBefore(sessionEndOfDay)
          ? end
          : sessionEndOfDay;

        if (currentStart.isSame(targetDate, "day")) {
          sessionsForDate.push({
            ...session,
            start_time: currentStart.toISOString(),
            end_time: sessionEnd.toISOString(),
            total_time: calculateTotalTime(currentStart, sessionEnd),
          });
        } else if (
          currentStart.isBefore(targetDate) &&
          sessionEnd.isAfter(targetDate)
        ) {
          const fullDaySessionStart = targetDate.clone().startOf("day");
          const fullDaySessionEnd = targetDate.clone().endOf("day");

          sessionsForDate.push({
            ...session,
            start_time: fullDaySessionStart.toISOString(),
            end_time: fullDaySessionEnd.toISOString(),
            total_time: calculateTotalTime(
              fullDaySessionStart,
              fullDaySessionEnd
            ),
          });
        }

        currentStart = sessionEnd.clone().add(1, "second");
      }
    });

    return sessionsForDate;
  };

  const calculateTotalTime = (
    start: moment.Moment,
    end: moment.Moment
  ): string => {
    const duration = moment.duration(end.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours} h, ${minutes} min`;
  };

  const changeDay = (offset: number): void => {
    if (!date) {
      console.error("Date not available");
      return;
    }
    const currentDate = moment.tz(date, "Europe/Stockholm").add(offset, "days");
    navigate(`/employee/${id}/day/${currentDate.format("YYYY-MM-DD")}`);
  };

  const handleEditSession = (sessionId: number) => {
    navigate(`/edit-work-hour/${sessionId}?date=${date}&employeeId=${id}`);
  };

  const handleDeleteSession = (sessionId: number) => {
    setShowModal(true);
    setSessionToDelete(sessionId);
  };

  const confirmDeleteSession = async () => {
    if (sessionToDelete !== null) {
      try {
        await api.delete(`/worksession/${sessionToDelete}`);
        const updatedSessions = sessions.filter(
          (session) => session.id !== sessionToDelete
        );
        setSessions(updatedSessions);
        setTotalTime(sumTotalTime(updatedSessions));
        setShowModal(false);
        setSessionToDelete(null);
      } catch (error) {
        console.error("Error deleting session: ", error);
        setError("Error deleting session");
        setShowModal(false);
        setSessionToDelete(null);
      }
    }
  };

  const handleAddSession = () => {
    navigate(`/add-work-hour?date=${date}&employeeId=${id}`);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center my-3">
        <Col md={6} className="d-flex justify-content-end">
          <div className="text-center">
            <Button
              variant="primary"
              className="btn-sm p-0"
              onClick={handleAddSession}
              title="Add"
            >
              <PlusSquare size={24} />
            </Button>
            <div>Add</div>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Card className="mt-3 mb-3">
            <Card.Header
              as="h6"
              className="d-flex justify-content-center align-items-center"
            >
              Daily summary
            </Card.Header>
            <Card.Body>
              <Card.Text className="small text-muted">
                <PersonCircle className="me-2" />
                {employee?.full_name}
              </Card.Text>
              <Card.Text className="small text-muted">
                <PersonBadge className="me-2" />
                {employee?.personnummer}
              </Card.Text>
              <Card.Text className="small text-muted">
                <Envelope className="me-2" />
                {employee?.user_email}
              </Card.Text>
              <Card.Text className="small text-muted">
                <HourglassSplit className="me-2" />
                <strong>{totalTime}</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center my-3">
        <Col md={6}>
          <Row className="justify-content-between">
            <Col className="text-start">
              <Button className="btn-sm" onClick={() => changeDay(-1)} variant="success">
                <ChevronLeft />
              </Button>
            </Col>

            <Col className="text-center">
              {date ? (
                <>
                  <div
                    className="font-weight-bold"
                    style={{ fontSize: "15px" }}
                  >
                    {moment.tz(date, "Europe/Stockholm").format("D MMMM YYYY")}
                  </div>
                  <small className="text-muted">
                    {moment.tz(date, "Europe/Stockholm").format("dddd")}
                  </small>
                </>
              ) : (
                <span>Date not available</span>
              )}
            </Col>

            <Col className="text-end">
              <Button className="btn-sm" onClick={() => changeDay(1)} variant="success">
                <ChevronRight />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {isLoadingSessions && (
        <Row className="justify-content-center my-5">
          <Col md={6} className="text-center">
            <Loader />
          </Col>
        </Row>
      )}
      {!isLoadingSessions && !error && !sessions.length && (
        <Row className="justify-content-center my-3">
          <Col md={6} className="text-center">
            <Alert variant="info" className="text-center">
              No work sessions for this day
            </Alert>
          </Col>
        </Row>
      )}
      {!isLoadingSessions && !error && sessions.length > 0 && (
        <ListGroup className="mb-4">
          {sessions.map((session) => (
            <Row key={session.id} className="justify-content-center">
              <Col md={6}>
                <ListGroup.Item className="mb-2 small">
                  <Row className="align-items-center">
                    <Col xs={12}>
                      <House className="me-2" /> {session.workplace.street} {session.workplace.street_number}, {session.workplace.postal_code} {session.workplace.city}
                    </Col>
                    <Col xs={12}>
                      <ClockFill className="me-2" />{" "}
                      {formatTime(session.start_time)}
                    </Col>
                    <Col xs={12}>
                      <ClockHistory className="me-2" />{" "}
                      {formatTime(session.end_time)}
                    </Col>
                    <Col xs={12}>
                      <HourglassSplit className="me-2" /> {session.total_time}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <div className="d-flex justify-content-around mt-3">
                        <div className="text-center">
                          <Button
                            variant="outline-success"
                            className="btn-sm p-0"
                            onClick={() => handleEditSession(session.id)}
                            title="Edit"
                          >
                            <PencilSquare size={24} />
                          </Button>
                          <div>Edit</div>
                        </div>
                        <div className="text-center">
                          <Button
                            variant="danger"
                            className="btn-sm p-0"
                            onClick={() => handleDeleteSession(session.id)}
                            title="Delete"
                          >
                            <Trash size={24} />
                          </Button>
                          <div>Delete</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </Col>
            </Row>
          ))}
        </ListGroup>
      )}

      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDeleteSession}
      >
        Confirm deletion of this work session
      </ConfirmModal>
    </Container>
  );
};

export default EmployeeDetailsByDay;

``````

---


## Zarządzanie błędami

Zarządzanie błędami w aplikacji Gurudo jest kluczowym elementem zapewnienia wysokiej jakości doświadczenia użytkownika. W tej sekcji opisano, jak obsługiwać błędy, aby aplikacja działała płynnie i była przyjazna dla użytkownika.

### Jak obsługiwać błędy w aplikacji

#### Wyświetlanie komunikatów o błędach

W aplikacji Gurudo wyświetlanie komunikatów o błędach jest realizowane za pomocą komponentów `Alert` z biblioteki React Bootstrap. Komunikaty o błędach informują użytkownika o problemach, które wystąpiły podczas korzystania z aplikacji, i sugerują możliwe kroki naprawcze.

``````jsx
import React, { useState } from 'react';
   import { Alert } from 'react-bootstrap';

   const ErrorNotification = ({ errorMessage }) => {
     return (
       <Alert variant="danger">
         {errorMessage}
       </Alert>
     );
   };

   export default ErrorNotification;
``````

#### Obsługa błędów sieciowych

Aplikacja Gurudo używa biblioteki Axios do wykonywania zapytań HTTP. Obsługa błędów sieciowych jest realizowana poprzez przechwytywanie błędów za pomocą interceptorów Axios.

``````jsx
import axios, { AxiosError, AxiosResponse } from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:8000',
     headers: {
       'Content-Type': 'application/json',
     },
   });

   api.interceptors.response.use(
     (response: AxiosResponse) => response,
     (error: AxiosError) => {
       if (error.response) {
         // W przypadku błędów serwera, wyświetl komunikat o błędzie
         console.error('Server Error:', error.response.data);
       } else if (error.request) {
         // W przypadku braku odpowiedzi serwera, wyświetl komunikat o błędzie
         console.error('Network Error:', error.request);
       } else {
         // Inne błędy
         console.error('Error:', error.message);
       }
       return Promise.reject(error);
     }
   );

   export default api;
``````

Poprawna obsługa błędów jest niezbędna do zapewnienia stabilności i użyteczności aplikacji. Stosowanie powyższych technik pomaga w identyfikacji, diagnozowaniu i rozwiązywaniu problemów, co przekłada się na lepsze doświadczenie użytkownika.

---

## Zarządzanie sesjami pracy

Zarządzanie sesjami pracy jest kluczowym aspektem działania aplikacji Gurudo. Poniżej opisano, jak aplikacja radzi sobie z różnymi aspektami zarządzania sesjami pracy, w tym aktualnymi sesjami, usuwaniem miejsc pracy, gdy są aktywne sesje, oraz innymi powiązanymi operacjami.

### Jak aplikacja radzi sobie z sesjami pracy
#### Aktualne sesje pracy

Aplikacja Gurudo śledzi aktualne sesje pracy pracowników, zapewniając wgląd w bieżące działania. Każdy pracownik może rozpocząć i zakończyć sesję pracy za pomocą przycisków "Start" i "End" na stronie głównej. Informacje o aktualnych sesjach są przechowywane i mogą być przeglądane przez pracodawców w celu monitorowania aktywności pracowników.

``````jsx
import React, { useState, useEffect } from "react";
import { Button, Alert, Container, Row, Col } from "react-bootstrap";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import ClockUpdate from "./ClockUpdate";
import WorkplaceSelector from "./WorkplaceSelector";
import ConfirmModal from "./ConfirmModal";
import Loader from "./Loader"; // Import the Loader component

interface Profile {
  id: number;
  user_email: string;
  user_id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  personnummer: string;
  created_at: string;
  updated_at: string;
  image: string;
}

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

interface Session {
  id: number;
  profile: Profile;
  workplace: Workplace;
  start_time: string;
  status: string;
}

const Home: React.FC = () => {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<number>(0);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [alertInfo, setAlertInfo] = useState<string>("");
  const [isActiveSession, setIsActiveSession] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => {});
  const [loading, setLoading] = useState(true); // Add loading state

  const { profileId } = useAuth();

  const handleSelectWorkplace = (id: number) => {
    setSelectedWorkplaceId(id);
  };

  useEffect(() => {
    const fetchWorkplacesAndSession = async () => {
      try {
        const workplacesResponse = await api.get("/workplace/");
        setWorkplaces(workplacesResponse.data);

        const sessionResponse = await api.get("/livesession/active/");
        if (sessionResponse.data.length > 0) {
          const userActiveSession = sessionResponse.data.find(
            (session: Session) => session.profile.id === Number(profileId)
          );
          if (userActiveSession) {
            setActiveSession(userActiveSession);
            setIsActiveSession(true);
            setSelectedWorkplaceId(userActiveSession.workplace.id);
            setAlertInfo("Work in progress. Click 'End' when done.");
          } else {
            setActiveSession(null);
            setIsActiveSession(false);
            setSelectedWorkplaceId(0);
            setAlertInfo("No active session. Click 'Start' to begin.");
          }
        } else {
          setActiveSession(null);
          setIsActiveSession(false);
          setSelectedWorkplaceId(0);
          setAlertInfo("Click 'Start' to begin.");
        }
      } catch (error) {
        setAlertInfo("Error fetching data");
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchWorkplacesAndSession();
  }, [profileId]);

  const handleStartSession = () => {
    if (!profileId || selectedWorkplaceId <= 0 || activeSession) {
      setAlertInfo("Select a workplace");
      return;
    }
    setModalText("Start work?");
    setModalAction(() => startSession);
    setShowModal(true);
  };

  const startSession = async () => {
    setShowModal(false);
    try {
      const response = await api.post("/livesession/start/", {
        workplace: selectedWorkplaceId,
        profile: profileId,
      });
      setActiveSession(response.data);
      setIsActiveSession(true);
      setAlertInfo("Session started. Click 'End' to finish");
    } catch (error) {
      console.error("Error starting session", error);
      setAlertInfo("Error starting session");
    }
  };

  const handleEndSession = () => {
    if (!activeSession || !activeSession.id) {
      setAlertInfo("No active session to end");
      return;
    }
    setModalText("End session?");
    setModalAction(() => endSession);
    setShowModal(true);
  };

  const endSession = async () => {
    if (!activeSession) return; // Additional check to ensure activeSession is not null
    setShowModal(false);
    try {
      await api.patch(`/livesession/end/${activeSession.id}/`);
      setActiveSession(null);
      setIsActiveSession(false);
      setSelectedWorkplaceId(0);
      setAlertInfo("Session ended");
    } catch (error) {
      console.error("Error ending session", error);
      setAlertInfo("Error ending session");
    }
  };

  const formatDate = (date: Date) => {
    const weekday = new Date(date).toLocaleDateString("en-EN", {
      weekday: "long",
    });
    const restOfDate = new Date(date).toLocaleDateString("en-EN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${weekday}, ${restOfDate}`;
  };

  const today = new Date();
  const formattedDate = formatDate(today);

  if (loading) {
    return <Loader />; // Show Loader while data is being fetched
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Row className="mb-0">
            <Col className="text-secondary text-center mb-0">
              <h2 style={{ fontSize: "18px" }}>{formattedDate}</h2>
            </Col>
          </Row>

          <Row>
            <Col className="text-center mb-4 mt-0">
              <ClockUpdate />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <WorkplaceSelector
            workplaces={workplaces}
            selectedWorkplaceId={selectedWorkplaceId}
            onSelect={handleSelectWorkplace}
            isActiveSession={isActiveSession}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col className="d-grid gap-2 my-3" md={4}>
          {!activeSession && (
            <Button
              variant="secondary"
              onClick={handleStartSession}
              disabled={!!activeSession}
              className="btn-lg"
              style={{ padding: "15px 25px", fontSize: "1rem" }}
            >
              Start
            </Button>
          )}
          {activeSession && (
            <Button
              variant="success"
              onClick={handleEndSession}
              disabled={!activeSession}
              className="btn-lg"
              style={{ padding: "15px 25px", fontSize: "1rem" }}
            >
              End
            </Button>
          )}
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4} className="text-center">
          {alertInfo && <Alert variant="info" className="text-center">{alertInfo}</Alert>}
        </Col>
      </Row>

      <ConfirmModal show={showModal} onHide={() => setShowModal(false)} onConfirm={modalAction}>
        {modalText}
      </ConfirmModal>
    </Container>
  );
};

export default Home;

``````

#### Usuwanie miejsc pracy, gdy są aktywne sesje
Aby zapewnić integralność danych, aplikacja nie pozwala na usunięcie miejsca pracy, gdy są z nim powiązane aktywne sesje pracy. Przed usunięciem miejsca pracy aplikacja sprawdza, czy żaden z pracowników nie jest obecnie zalogowany i nie pracuje w tym miejscu.

``````jsx
import React, { useEffect, useState } from "react";
import { Container, Col, Row, Button, Accordion, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UserProfileContext";
import Loader from "./Loader";
import { PencilSquare, PlusSquare, Trash } from "react-bootstrap-icons";
import ConfirmModal from "./ConfirmModal";
import api from "../api/api";
import { IWorkPlacesData } from "../api/interfaces/types";

const WorkPlaceContainer: React.FC = () => {
  const [workplaces, setWorkplaces] = useState<IWorkPlacesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [workplaceToDelete, setWorkplaceToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<{ id: number; message: string } | null>(null);
  const navigate = useNavigate();
  const { profile, loadProfile } = useUserProfile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      await loadProfile();
      setIsAuthenticated(!!profile);
      setLoading(false);
    };

    fetchProfile();
  }, [profile, loadProfile]);

  const fetchWorkplaces = async () => {
    try {
      setLoading(true);
      const response = await api.get<IWorkPlacesData[]>("/workplace/");
      setWorkplaces(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Unable to load workplaces", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkplaces();
  }, []);

  const fetchActiveSessions = async (workplaceId: number) => {
    try {
      const response = await api.get("/employee/");
      const activeSessions = response.data.filter(
        (employee: any) => 
          employee.current_workplace && 
          employee.current_workplace.id === workplaceId &&
          employee.current_session_status === "Trwa"
      );
      return activeSessions.length > 0;
    } catch (error) {
      console.error("Failed to verify workplace usage", error);
      return false;
    }
  };

  const handleAddClick = () => {
    navigate("/add-work-place");
  };

  const handleEditClick = (id: number) => {
    navigate(`/edit-work-place/${id}`);
  };

  const handleDeleteClick = async (id: number) => {
    const isActive = await fetchActiveSessions(id);

    if (isActive) {
      setDeleteError({ id, message: "Cannot delete, workplace in use. Try again later" });
      setTimeout(() => {
        setDeleteError(null);
      }, 3000); // Hide the alert after 5 seconds
    } else {
      setShowModal(true);
      setWorkplaceToDelete(id);
      setDeleteError(null);
    }
  };

  const confirmDeleteWorkplace = async () => {
    if (workplaceToDelete !== null) {
      try {
        await api.delete(`/workplace/${workplaceToDelete}/`);
        setWorkplaceToDelete(null);
        setShowModal(false);
        fetchWorkplaces(); // Refresh the workplaces after deletion
      } catch (error) {
        console.error("Unable to delete workplace", error);
        setShowModal(false);
        setDeleteError({ id: workplaceToDelete, message: "Cannot delete this workplace as it is currently in use. Please try again later." });
        setTimeout(() => {
          setDeleteError(null);
        }, 3000); // Hide the alert after 5 seconds
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="mt-4">
      {isAuthenticated && profile?.is_employer && (
        <Row className="justify-content-center my-3">
          <Col md={6} className="d-flex justify-content-end">
            <div className="text-center">
              <Button
                variant="primary"
                className="btn-sm p-0"
                onClick={handleAddClick}
                title="Add"
              >
                <PlusSquare size={24} />
              </Button>
              <div>Add</div>
            </div>
          </Col>
        </Row>
      )}
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Accordion className="text-center">
            {workplaces.map((workplace, index) => (
              <Accordion.Item eventKey={String(index)} key={workplace.id}>
                <Accordion.Header className="text-center">
                  <div className="d-flex flex-column justify-content-center">
                    <span>{`${workplace.street} ${workplace.street_number}`}</span>
                    <span>{`${workplace.postal_code} ${workplace.city}`}</span>
                  </div>
                </Accordion.Header>

                {isAuthenticated && profile?.is_employer && (
                  <Accordion.Body>
                    <div className="d-flex justify-content-around mt-3">
                      <div className="text-center">
                        <Button
                          variant="outline-success"
                          className="btn-sm p-0"
                          onClick={() => handleEditClick(workplace.id)}
                          title="Edit"
                        >
                          <PencilSquare size={24} />
                        </Button>
                        <div>Edit</div>
                      </div>
                      <div className="text-center">
                        <Button
                          variant="danger"
                          className="btn-sm p-0"
                          onClick={() => handleDeleteClick(workplace.id)}
                          title="Delete"
                        >
                          <Trash size={24} />
                        </Button>
                        <div>Delete</div>
                      </div>
                    </div>
                    {deleteError && deleteError.id === workplace.id && (
                      <Alert variant="warning" className="mt-3 text-center">
                        {deleteError.message}
                      </Alert>
                    )}
                  </Accordion.Body>
                )}
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>

      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDeleteWorkplace}
      >
        Are you sure you want to delete this workplace?
      </ConfirmModal>
    </Container>
  );
};

export default WorkPlaceContainer;

``````

#### Monitorowanie aktywności pracowników
Pracodawcy mają dostęp do przeglądania bieżącej aktywności swoich pracowników. Mogą zobaczyć, którzy pracownicy są obecnie zalogowani i w jakich miejscach pracują, co umożliwia lepsze zarządzanie zespołem i zasobami.

``````jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import api from "../api/api";
import { Employee } from "../api/interfaces/types";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  HourglassSplit,
  Person,
  PersonFill,
  GeoAlt,
  CheckCircle,
  XCircle,
  Power,
  Clock,
  ClockHistory,
} from "react-bootstrap-icons";
import TimeElapsed from "./TimeElapsed";
import Loader from "./Loader";
import ConfirmModal from "./ConfirmModal";
import { formatDateTime } from "../utils/dateUtils";

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get<Employee[]>("/employee");
        setEmployees(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching employees:", err);
        setError("Error fetching employees");
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployee = (id: number) => {
    navigate(`/employees/${id}`);
  };

  const handleEndSession = async () => {
    if (selectedSessionId !== null) {
      try {
        await api.patch(`/livesession/end/${selectedSessionId}/`);
        const updatedEmployees = employees.map((employee) =>
          employee.current_session_id === selectedSessionId
            ? { ...employee, current_session_status: "Zakończona" }
            : employee
        );
        setEmployees(updatedEmployees);
        setShowModal(false);
      } catch (error) {
        console.error("Error ending session", error);
        setError("Error ending session");
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Accordion>
            {employees.map((employee, index) => (
              <Accordion.Item eventKey={String(index)} key={employee.id}>
                <Accordion.Header>
                  {employee.current_session_status === "Trwa" ? (
                    <PersonFill className="me-2 text-success" />
                  ) : (
                    <Person className="me-2" />
                  )}
                  {employee.full_name}
                </Accordion.Header>
                <Accordion.Body
                  style={{ fontSize: "0.9em", lineHeight: "1.6" }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      {employee.current_session_status === "Trwa" ? (
                        <CheckCircle className="text-success me-2" />
                      ) : (
                        <XCircle className="text-danger me-2" />
                      )}
                      {employee.current_session_status === "Trwa"
                        ? "Currently working"
                        : "Not working"}
                    </div>
                  </div>
                  {employee.current_session_status === "Trwa" && (
                    <>
                      <div className="d-flex align-items-center mb-2">
                        <GeoAlt className="me-2" />
                        {employee.current_workplace && (
                          `${employee.current_workplace.street} ${employee.current_workplace.street_number}, ${employee.current_workplace.postal_code} ${employee.current_workplace.city}`
                        )}
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <Clock className="me-2" />
                        {formatDateTime(employee.current_session_start_time)}
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <HourglassSplit className="me-2" />
                        <TimeElapsed
                          startTime={employee.current_session_start_time}
                        />
                      </div>
                    </>
                  )}
                  <div className="d-flex justify-content-around mt-3">
                    <div className="text-center">
                      <Button
                        variant="primary"
                        className="btn-sm p-0"
                        onClick={() => handleEmployee(employee.id)}
                        title="Show More"
                      >
                        <ClockHistory size={24} />
                      </Button>
                      <div>Show Hours</div>
                    </div>
                    {employee.current_session_status === "Trwa" && (
                      <div className="text-center">
                        <Button
                          variant="danger"
                          className="btn-sm p-0"
                          onClick={() => {
                            setSelectedSessionId(employee.current_session_id);
                            setShowModal(true);
                          }}
                          title="End Session"
                        >
                          <Power size={24} />
                        </Button>
                        <div>End Session</div>
                      </div>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>

      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleEndSession}
      >
        Confirm ending this session
      </ConfirmModal>
    </Container>
  );
};

export default EmployeeList;

``````

Zarządzanie sesjami pracy w aplikacji Gurudo jest zaprojektowane w taki sposób, aby zapewnić zarówno pracownikom, jak i pracodawcom efektywne narzędzia do monitorowania i zarządzania czasem pracy.

---

## Testy manualne
### Błędy w aplikacji - Wykonane poprawki

1. **Błąd przy edycji godzin pracy na telefonie.**
   - Błąd związany z przekazywaniem obiektu w postaci stringa, gdy serwer oczekiwał jedynie typu numer ID. Naprawiono.

2. **Poprawa stylu przycisków "Next" i "Back".**
   - Przyciski były za duże, utrudniając prawidłowy UX. Zaktualizowano styl.

3. **Powrót z edycji godzin pracy do konkretnego dnia.**
   - Aplikacja nie powracała do poprzedniego widoku po edycji godzin pracy. Naprawiono.

4. **Powrót pracodawcy z widoku dnia do miesiąca.**
   - Błąd związany z niewłaściwym endpointem. Teraz ładuje poprawnie dane użytkownika po powrocie.

5. **Brak kluczyka przy formularzu zmiany hasła.**
   - Dodano możliwość podglądu wpisanego hasła w formularzu zmiany hasła.

6. **Informacja o wygaśnięciu linka.**
   - Dodano alert informujący o wygaśnięciu linka oraz przekierowanie do funkcji odzyskiwania hasła.

7. **Słabe połączenie z internetem.**
   - Dodano informację o braku połączenia sieciowego. Alert pojawia się przy braku połączenia i znika po jego przywróceniu.

8. **Loader na widoku dziennym.**
   - Zoptymalizowano działanie loadera, aby ładował tylko sesje pracy, a nie cały komponent.

9. **Loader przy przyciskach.**
   - Dodano loader przy przyciskach, aby informować użytkownika o oczekiwaniu na odpowiedź z serwera.

10. **Tytuł i przycisk powrotu w Navbar w widoku dodawania sesji pracy.**
    - Dodano prawidłowy tytuł i przycisk powrotu.

11. **Modal przy przycisku usunięcia sesji pracy.**
    - Dodano modal potwierdzający usunięcie sesji pracy, zwiększając bezpieczeństwo operacji.

12. **Modal przy usuwaniu miejsca pracy.**
    - Dodano modal potwierdzający usunięcie miejsca pracy oraz odświeżanie listy miejsc pracy.

13. **Usunięcie profilu użytkownika.**
    - Dodano możliwość usunięcia konta użytkownika wraz z potwierdzeniem i informacją o nieodwracalności operacji.

14. **Blokada usunięcia miejsca pracy przy aktywnej sesji.**
    - Dodano funkcję zabezpieczającą przed usunięciem miejsca pracy, gdy ktoś aktualnie tam pracuje.

15. **Odświeżanie stanu po dodaniu godzin pracy przez pracodawcę.**
    - Dodano automatyczne odświeżanie stanu godzin pracy po ich dodaniu.

16. **Problem przy ładowaniu sesji pracy przez nowego użytkownika.**
    - Dodano alert informujący o braku sesji pracy dla nowego użytkownika.

17. **Blokada dostępu do strony logowania dla zalogowanych użytkowników.**
    - Dodano przekierowanie zalogowanego użytkownika na stronę główną.

18. **Automatyczne wylogowanie po zmianie hasła.**
    - Po zmianie hasła użytkownik jest teraz automatycznie wylogowywany i przekierowywany na stronę logowania.

19. **Poprawa wyświetlania alertów.**
    - Poprawiono styl wyświetlania alertów i podzielono je na kategorie (info, warning, danger).

20. **Poprawa widoku dla aktywnej sesji.**
    - Ustandaryzowano widok aktywnej sesji użytkownika.

21. **Nazwy dni tygodnia w widoku miesięcznym.**
    - Dodano nazwy dni tygodnia, zwiększając przejrzystość widoku.

22. **Ustandaryzowanie adresów miejsc pracy.**
    - Ustandaryzowano format wyświetlania adresów miejsc pracy.

23. **Kapitalizacja imienia i nazwiska.**
    - Wprowadzono automatyczną kapitalizację imienia i nazwiska użytkownika.

### Błędy aplikacji do zrobienia w przyszłości

1. **Link aktywacyjny po rejestracji na maila.**
   - Wprowadzenie funkcji wysyłania linka aktywacyjnego na adres e-mail w celu potwierdzenia autentyczności użytkownika. Zwiększy to bezpieczeństwo i zapobiegnie rejestracji na nieistniejące adresy e-mail.


---

## Informacje o autorze

Projekt Gurudo został stworzony i jest utrzymywany przez Lucka Baron, doświadczonego Full Stack Developera. Jeśli masz jakiekolwiek pytania dotyczące projektu, potrzebujesz pomocy lub masz sugestie dotyczące rozwoju aplikacji, prosimy o kontakt:

- **Imię i nazwisko:** Lucka Baron
- **Rola:** Full Stack Developer
- **E-mail:** bakatjur@gmail.com

Lucka Baron jest otwarty na wszelkie pytania i chętnie pomoże w rozwiązaniu wszelkich problemów związanych z aplikacją Gurudo.

---

## Licencja
Projekt Gurudo jest udostępniany na licencji MIT. Poniżej znajdują się szczegółowe informacje na temat licencji:

``````
MIT License

  Copyright (c) 2024 Lucka Baron

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
``````
  

---

## Podziękowania

Serdeczne podziękowania dla:

- Mojej dziewczyny, Swietłany, która wspierała mnie na każdym etapie tworzenia projektu.
- Wszystkich ludzi, którzy pomogli mi w testach manualnych i używali aplikacji.
- Przyjaciół, którzy zainspirowali mnie do stworzenia aplikacji.

Dziękuję za waszą nieocenioną pomoc i wsparcie.