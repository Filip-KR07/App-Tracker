# iOS-App mit Capacitor bauen

Diese Anleitung verpackt die Web-App als native iOS-App für den App Store.
**Xcode auf einem Mac ist erforderlich.**

## Voraussetzungen
- macOS mit **Xcode** (aus dem App Store)
- **Node.js** (https://nodejs.org)
- **CocoaPods**: `sudo gem install cocoapods`
- Aktiver **Apple Developer Account** (99 $/Jahr) für den Store-Upload

## 1. App-ID festlegen
In `capacitor.config.json` den Platzhalter `appId` in deine eigene
Bundle-ID ändern, z. B. `com.filip.tracker` (Reverse-Domain, eindeutig).
Optional `appName` anpassen.

## 2. Abhängigkeiten installieren
```bash
npm install
```

## 3. iOS-Projekt anlegen (einmalig)
```bash
npm run add:ios
```
Das kopiert die Web-Assets nach `www/` und erzeugt den Ordner `ios/`.

## 4. Nach jeder Web-Änderung synchronisieren
```bash
npm run sync
```
Kopiert `index.html` & Co. neu nach `www/` und aktualisiert das iOS-Projekt.

## 5. In Xcode öffnen
```bash
npm run open:ios
```
Dann in Xcode:
1. Projekt anwählen → **Signing & Capabilities** → dein Team wählen
   (Bundle-ID muss mit `appId` übereinstimmen).
2. Gerät/Simulator wählen → **Run** (▶) zum Testen.
3. Für den Store: **Product → Archive** → **Distribute App** →
   **App Store Connect**.

## Hinweise
- **Icons**: Nach dem Icon-Set (siehe `scripts/generate-icons.mjs`) die
  PNGs in `ios/App/App/Assets.xcassets/AppIcon.appiconset/` einsetzen bzw.
  in Xcode zuweisen.
- **Push**: Für native Push-Benachrichtigungen zusätzlich
  `@capacitor/push-notifications` installieren und APNs im Apple Developer
  Portal konfigurieren (siehe `PUSH.md`).
- `www/`, `ios/` und `node_modules/` sind in `.gitignore` ausgenommen bzw.
  können bei Bedarf eingecheckt werden.
