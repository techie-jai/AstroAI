#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
UI Components - Main user interface for AstroAI chart generation
Simple form-based interface for collecting birth data
"""

import sys
import os
from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                             QLineEdit, QComboBox, QPushButton, QProgressBar,
                             QDateEdit, QTimeEdit, QMessageBox, QCompleter,
                             QGroupBox, QFormLayout, QTextEdit, QDialog)
from PyQt6.QtCore import Qt, QDate, QTime, pyqtSignal
from PyQt6.QtGui import QFont, QDoubleValidator

try:
    from local_values import GEMINI_API_KEY
except ImportError:
    GEMINI_API_KEY = None

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


class AstroAIMainWindow(QWidget):
    """Main window for AstroAI chart generation"""
    
    generate_requested = pyqtSignal(dict)
    analyze_requested = pyqtSignal(str, str)  # (kundli_json_path, api_key)
    
    def __init__(self):
        super().__init__()
        self.setMinimumSize(800, 700)
        
        self._init_ui()
        self._connect_signals()
        self._set_default_values()
    
    def _init_ui(self):
        """Initialize the user interface"""
        main_layout = QVBoxLayout()
        main_layout.setSpacing(15)
        
        # Title
        title_label = QLabel("AstroAI Chart Generator")
        title_font = QFont("Arial", 18, QFont.Weight.Bold)
        title_label.setFont(title_font)
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        main_layout.addWidget(title_label)
        
        subtitle_label = QLabel("Generate all divisional charts (D1-D60) for birth data")
        subtitle_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        main_layout.addWidget(subtitle_label)
        
        # Personal Information Group
        personal_group = self._create_personal_info_group()
        main_layout.addWidget(personal_group)
        
        # Birth Details Group
        birth_group = self._create_birth_details_group()
        main_layout.addWidget(birth_group)
        
        # Location Details Group
        location_group = self._create_location_group()
        main_layout.addWidget(location_group)
        
        # Progress section
        progress_group = self._create_progress_group()
        main_layout.addWidget(progress_group)
        
        # Buttons layout
        buttons_layout = QHBoxLayout()
        
        # Generate button
        self.generate_btn = QPushButton("Generate All Charts")
        self.generate_btn.setMinimumHeight(50)
        self.generate_btn.setFont(QFont("Arial", 12, QFont.Weight.Bold))
        self.generate_btn.setStyleSheet("""
            QPushButton {
                background-color: #4CAF50;
                color: white;
                border-radius: 5px;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
            QPushButton:disabled {
                background-color: #cccccc;
                color: #666666;
            }
        """)
        buttons_layout.addWidget(self.generate_btn)
        
        # Analyse using AI button
        self.analyze_btn = QPushButton("Analyse using AI")
        self.analyze_btn.setMinimumHeight(50)
        self.analyze_btn.setFont(QFont("Arial", 12, QFont.Weight.Bold))
        self.analyze_btn.setEnabled(False)
        self.analyze_btn.setStyleSheet("""
            QPushButton {
                background-color: #2196F3;
                color: white;
                border-radius: 5px;
            }
            QPushButton:hover {
                background-color: #0b7dda;
            }
            QPushButton:disabled {
                background-color: #cccccc;
                color: #666666;
            }
        """)
        buttons_layout.addWidget(self.analyze_btn)
        
        main_layout.addLayout(buttons_layout)
        
        # Status label
        self.status_label = QLabel("")
        self.status_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.status_label.setStyleSheet("color: #666; font-style: italic;")
        main_layout.addWidget(self.status_label)
        
        main_layout.addStretch()
        self.setLayout(main_layout)
    
    def _create_personal_info_group(self) -> QGroupBox:
        """Create personal information input group"""
        group = QGroupBox("Personal Information")
        layout = QFormLayout()
        
        # Name
        self.name_input = QLineEdit()
        self.name_input.setPlaceholderText("Enter full name")
        layout.addRow("Name*:", self.name_input)
        
        # Gender
        self.gender_combo = QComboBox()
        self.gender_combo.addItems(['Female', 'Male', 'Transgender', 'No preference'])
        layout.addRow("Gender:", self.gender_combo)
        
        group.setLayout(layout)
        return group
    
    def _create_birth_details_group(self) -> QGroupBox:
        """Create birth date and time input group"""
        group = QGroupBox("Birth Details")
        layout = QFormLayout()
        
        # Date of Birth
        self.dob_input = QDateEdit()
        self.dob_input.setCalendarPopup(True)
        self.dob_input.setDisplayFormat("yyyy-MM-dd")
        self.dob_input.setDate(QDate.currentDate())
        layout.addRow("Date of Birth*:", self.dob_input)
        
        # Time of Birth
        self.tob_input = QTimeEdit()
        self.tob_input.setDisplayFormat("HH:mm:ss")
        self.tob_input.setTime(QTime(12, 0, 0))
        layout.addRow("Time of Birth*:", self.tob_input)
        
        group.setLayout(layout)
        return group
    
    def _create_location_group(self) -> QGroupBox:
        """Create location input group"""
        group = QGroupBox("Birth Location")
        layout = QFormLayout()
        
        # Place
        self.place_input = QLineEdit()
        self.place_input.setPlaceholderText("Enter city name (e.g., Delhi, Mumbai, Chennai)...")
        
        # Simple autocomplete with major cities
        major_cities = [
            "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", 
            "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
            "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad",
            "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik",
            "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar",
            "Varanasi", "Srinagar", "Dhanbad", "Jodhpur", "Amritsar", "Raipur",
            "Allahabad", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada",
            "Madurai", "Guwahati", "Chandigarh", "Hubli-Dharwad", "Mysore",
            "Tiruchirappalli", "New York", "London", "Tokyo", "Paris", "Singapore"
        ]
        
        completer = QCompleter(major_cities)
        completer.setCaseSensitivity(Qt.CaseSensitivity.CaseInsensitive)
        completer.setFilterMode(Qt.MatchFlag.MatchContains)
        self.place_input.setCompleter(completer)
        
        layout.addRow("Place*:", self.place_input)
        
        # Latitude
        self.lat_input = QLineEdit()
        self.lat_input.setPlaceholderText("e.g., 13.0827")
        lat_validator = QDoubleValidator(-90.0, 90.0, 6)
        self.lat_input.setValidator(lat_validator)
        layout.addRow("Latitude*:", self.lat_input)
        
        # Longitude
        self.long_input = QLineEdit()
        self.long_input.setPlaceholderText("e.g., 80.2707")
        long_validator = QDoubleValidator(-180.0, 180.0, 6)
        self.long_input.setValidator(long_validator)
        layout.addRow("Longitude*:", self.long_input)
        
        # Timezone
        self.tz_input = QLineEdit()
        self.tz_input.setPlaceholderText("e.g., 5.5 for IST")
        tz_validator = QDoubleValidator(-12.0, 14.0, 2)
        self.tz_input.setValidator(tz_validator)
        layout.addRow("Timezone (UTC offset)*:", self.tz_input)
        
        # Info label
        info_label = QLabel("Tip: Select a place from autocomplete to auto-fill coordinates")
        info_label.setStyleSheet("color: #666; font-size: 10px; font-style: italic;")
        layout.addRow("", info_label)
        
        group.setLayout(layout)
        return group
    
    def _create_progress_group(self) -> QGroupBox:
        """Create progress display group"""
        group = QGroupBox("Generation Progress")
        layout = QVBoxLayout()
        
        # Progress bar
        self.progress_bar = QProgressBar()
        self.progress_bar.setMinimum(0)
        self.progress_bar.setMaximum(100)
        self.progress_bar.setValue(0)
        self.progress_bar.setTextVisible(True)
        layout.addWidget(self.progress_bar)
        
        # Progress message
        self.progress_label = QLabel("Ready to generate charts")
        self.progress_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.progress_label)
        
        group.setLayout(layout)
        return group
    
    def _connect_signals(self):
        """Connect UI signals"""
        self.generate_btn.clicked.connect(self._on_generate_clicked)
        self.analyze_btn.clicked.connect(self._on_analyze_clicked)
        self.place_input.textChanged.connect(self._on_place_changed)
        
        # Connect validation to all required fields
        self.name_input.textChanged.connect(self._validate_inputs)
        self.place_input.textChanged.connect(self._validate_inputs)
        self.lat_input.textChanged.connect(self._validate_inputs)
        self.long_input.textChanged.connect(self._validate_inputs)
        self.tz_input.textChanged.connect(self._validate_inputs)
    
    def _set_default_values(self):
        """Set default values"""
        # Set default to Delhi
        self.place_input.setText("Delhi,IN")
        self.lat_input.setText("28.6139")
        self.long_input.setText("77.209")
        self.tz_input.setText("5.5")
        
        self._validate_inputs()
    
    def _on_place_changed(self, text: str):
        """Handle place selection from autocomplete"""
        # Simple city lookup for major cities
        city_coordinates = {
            "Delhi": (28.6139, 77.209, 5.5),
            "Mumbai": (19.0760, 72.8777, 5.5),
            "Bangalore": (12.9716, 77.5946, 5.5),
            "Chennai": (13.0827, 80.2707, 5.5),
            "Kolkata": (22.5726, 88.3639, 5.5),
            "Hyderabad": (17.3850, 78.4867, 5.5),
            "Pune": (18.5204, 73.8567, 5.5),
            "Ahmedabad": (23.0225, 72.5714, 5.5),
            "Jaipur": (26.9124, 75.7873, 5.5),
            "Lucknow": (26.8467, 80.9462, 5.5),
            "New York": (40.7128, -74.0060, -5.0),
            "London": (51.5074, -0.1278, 0.0),
            "Tokyo": (35.6762, 139.6503, 9.0),
            "Paris": (48.8566, 2.3522, 1.0),
            "Singapore": (1.3521, 103.8198, 8.0)
        }
        
        if text in city_coordinates:
            lat, lon, tz = city_coordinates[text]
            self.lat_input.setText(str(lat))
            self.long_input.setText(str(lon))
            self.tz_input.setText(str(tz))
    
    def _validate_inputs(self) -> bool:
        """Validate all required inputs"""
        is_valid = True
        
        # Check required fields
        if not self.name_input.text().strip():
            is_valid = False
        
        if not self.place_input.text().strip():
            is_valid = False
        
        try:
            lat = float(self.lat_input.text())
            if not (-90 <= lat <= 90):
                is_valid = False
        except ValueError:
            is_valid = False
        
        try:
            lon = float(self.long_input.text())
            if not (-180 <= lon <= 180):
                is_valid = False
        except ValueError:
            is_valid = False
        
        try:
            tz = float(self.tz_input.text())
            if not (-12 <= tz <= 14):
                is_valid = False
        except ValueError:
            is_valid = False
        
        # Enable/disable generate button
        self.generate_btn.setEnabled(is_valid)
        
        if is_valid:
            self.status_label.setText("✓ All fields valid - ready to generate")
            self.status_label.setStyleSheet("color: green; font-style: italic;")
        else:
            self.status_label.setText("Please fill all required fields (*)")
            self.status_label.setStyleSheet("color: #ff6666; font-style: italic;")
        
        return is_valid
    
    def _on_generate_clicked(self):
        """Handle generate button click"""
        if not self._validate_inputs():
            QMessageBox.warning(self, "Invalid Input", 
                              "Please fill all required fields correctly.")
            return
        
        # Collect user data
        date = self.dob_input.date()
        time = self.tob_input.time()
        
        user_data = {
            'name': self.name_input.text().strip(),
            'gender': self.gender_combo.currentText(),
            'year': date.year(),
            'month': date.month(),
            'day': date.day(),
            'hour': time.hour(),
            'minute': time.minute(),
            'second': time.second(),
            'place_name': self.place_input.text().strip(),
            'latitude': float(self.lat_input.text()),
            'longitude': float(self.long_input.text()),
            'timezone_offset': float(self.tz_input.text())
        }
        
        # Emit signal
        self.generate_requested.emit(user_data)
    
    def _on_analyze_clicked(self):
        """Handle analyze button click"""
        # Use API key from local_values.py
        if not GEMINI_API_KEY:
            QMessageBox.critical(self, "Missing API Key", 
                               "Gemini API key not found in local_values.py.\n"
                               "Please add your API key to the local_values.py file.")
            return
        
        # Emit signal with kundli path and API key
        self.analyze_requested.emit(self.kundli_json_path, GEMINI_API_KEY)
    
    def set_kundli_path(self, kundli_path: str):
        """Set the path to the kundli JSON file"""
        self.kundli_json_path = kundli_path
        self.analyze_btn.setEnabled(True)
    
    def enable_analyze_button(self, enabled: bool):
        """Enable or disable the analyze button"""
        self.analyze_btn.setEnabled(enabled)
    
    def set_generating_state(self, is_generating: bool):
        """Set UI state during generation"""
        self.generate_btn.setEnabled(not is_generating)
        self.name_input.setEnabled(not is_generating)
        self.gender_combo.setEnabled(not is_generating)
        self.dob_input.setEnabled(not is_generating)
        self.tob_input.setEnabled(not is_generating)
        self.place_input.setEnabled(not is_generating)
        self.lat_input.setEnabled(not is_generating)
        self.long_input.setEnabled(not is_generating)
        self.tz_input.setEnabled(not is_generating)
        
        if is_generating:
            self.generate_btn.setText("Generating...")
        else:
            self.generate_btn.setText("Generate All Charts")
    
    def update_progress(self, percentage: int, message: str):
        """Update progress bar and message"""
        self.progress_bar.setValue(percentage)
        self.progress_label.setText(message)
    
    def show_success(self, folder_path: str):
        """Show success message"""
        msg = QMessageBox(self)
        msg.setIcon(QMessageBox.Icon.Information)
        msg.setWindowTitle("Success!")
        msg.setText("All charts generated successfully!")
        msg.setInformativeText(f"Charts saved to:\n{folder_path}")
        msg.setStandardButtons(QMessageBox.StandardButton.Ok)
        
        # Add button to open folder
        open_btn = msg.addButton("Open Folder", QMessageBox.ButtonRole.ActionRole)
        
        result = msg.exec()
        
        # Check if open folder was clicked
        if msg.clickedButton() == open_btn:
            self._open_folder(folder_path)
    
    def show_error(self, error_message: str):
        """Show error message"""
        QMessageBox.critical(self, "Error", f"Chart generation failed:\n\n{error_message}")
    
    def _open_folder(self, folder_path: str):
        """Open folder in file explorer"""
        import subprocess
        import platform
        
        try:
            if platform.system() == "Windows":
                os.startfile(folder_path)
            elif platform.system() == "Darwin":  # macOS
                subprocess.Popen(["open", folder_path])
            else:  # Linux
                subprocess.Popen(["xdg-open", folder_path])
        except Exception as e:
            QMessageBox.warning(self, "Cannot Open Folder", 
                              f"Could not open folder: {str(e)}")


class APIKeyDialog(QDialog):
    """Dialog for entering Gemini API key"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Enter Gemini API Key")
        self.setMinimumWidth(500)
        self._init_ui()
    
    def _init_ui(self):
        """Initialize the dialog UI"""
        layout = QVBoxLayout()
        
        # Info label
        info_label = QLabel("Enter your Google Gemini API key to analyse the kundli:")
        info_label.setWordWrap(True)
        layout.addWidget(info_label)
        
        # API key input
        self.api_key_input = QLineEdit()
        self.api_key_input.setPlaceholderText("Paste your Gemini API key here...")
        self.api_key_input.setEchoMode(QLineEdit.EchoMode.Password)
        layout.addWidget(self.api_key_input)
        
        # Info about getting API key
        help_label = QLabel(
            "Get your API key from: https://makersuite.google.com/app/apikey\n"
            "Keep your API key secure and never share it."
        )
        help_label.setWordWrap(True)
        help_label.setStyleSheet("color: #666; font-size: 10px; font-style: italic;")
        layout.addWidget(help_label)
        
        # Buttons
        button_layout = QHBoxLayout()
        
        ok_btn = QPushButton("Analyse")
        ok_btn.clicked.connect(self.accept)
        button_layout.addWidget(ok_btn)
        
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        button_layout.addWidget(cancel_btn)
        
        layout.addLayout(button_layout)
        
        self.setLayout(layout)
    
    def get_api_key(self) -> str:
        """Get the entered API key"""
        return self.api_key_input.text()
