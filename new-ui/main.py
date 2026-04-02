#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
AstroAI Chart Generator - Main Application
Simple UI for generating all divisional charts from birth data
"""

import sys
import os
from PyQt6.QtWidgets import QApplication, QMessageBox
from PyQt6.QtCore import QThread

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'PyJHora'))

# Set up ephemeris path before importing anything else
import swisseph as swe
ephe_path = os.path.join(os.path.dirname(__file__), '..', 'PyJHora', 'jhora', 'data', 'ephe')
ephe_path = os.path.abspath(ephe_path)
swe.set_ephe_path(ephe_path)

from ui_components import AstroAIMainWindow
from chart_generator import ChartGeneratorWorker, ChartImageRenderer
from file_manager import FileManager


class AstroAIApplication:
    """Main application controller"""
    
    def __init__(self):
        self.app = QApplication(sys.argv)
        self.window = AstroAIMainWindow()
        self.file_manager = FileManager(base_dir=os.path.join(os.path.dirname(__file__), '..', 'users'))
        self.image_renderer = ChartImageRenderer(chart_style='south_indian')
        
        self.worker = None
        self.worker_thread = None
        self.current_folder = None
        self.generated_charts = []
        self.kundli_generated = False
        
        # Connect signals
        self.window.generate_requested.connect(self.start_generation)
        
        # Set window icon if available
        try:
            from PyQt6.QtGui import QIcon
            icon_path = os.path.join(os.path.dirname(__file__), '..', 'PyJHora', 'jhora', 'ui', 'images', 'lord_ganesha2.jpg')
            if os.path.exists(icon_path):
                self.window.setWindowIcon(QIcon(icon_path))
        except:
            pass
    
    def start_generation(self, user_data: dict):
        """Start chart generation process"""
        try:
            # Create user folder
            self.window.update_progress(0, "Creating user folder...")
            self.current_folder, unique_id = self.file_manager.create_user_folder(user_data['name'])
            
            # Save user info
            user_info = user_data.copy()
            user_info['unique_id'] = unique_id
            self.file_manager.save_user_info(self.current_folder, user_info)
            
            # Reset generated charts list
            self.generated_charts = []
            
            # Create worker thread
            self.worker = ChartGeneratorWorker(user_data)
            self.worker_thread = QThread()
            self.worker.moveToThread(self.worker_thread)
            
            # Connect signals
            self.worker_thread.started.connect(self.worker.run)
            self.worker.progress.connect(self.on_progress)
            self.worker.kundli_generated.connect(self.on_kundli_generated)
            self.worker.chart_generated.connect(self.on_chart_generated)
            self.worker.finished.connect(self.on_generation_finished)
            self.worker.error.connect(self.on_error)
            
            # Set UI to generating state
            self.window.set_generating_state(True)
            
            # Start worker
            self.worker_thread.start()
            
        except Exception as e:
            self.window.show_error(f"Failed to start generation: {str(e)}")
            self.window.set_generating_state(False)
    
    def on_progress(self, percentage: int, message: str):
        """Handle progress updates"""
        self.window.update_progress(percentage, message)
    
    def on_kundli_generated(self, kundli_data: dict, kundli_text: str):
        """Handle kundli generation"""
        try:
            user_name = self.window.name_input.text()
            kundli_filename = f"{user_name}_Kundli"
            
            # Save kundli JSON
            self.file_manager.save_chart_json(self.current_folder, kundli_filename, kundli_data)
            
            # Save kundli text
            self.file_manager.save_chart_text(self.current_folder, kundli_filename, kundli_text)
            
            self.kundli_generated = True
            print(f"Kundli saved as: {kundli_filename}")
            
        except Exception as e:
            print(f"Error saving kundli: {e}")
    
    def on_chart_generated(self, chart_type: str, chart_data: dict, chart_text: str):
        """Handle individual chart generation"""
        try:
            # Save JSON
            self.file_manager.save_chart_json(self.current_folder, chart_type, chart_data)
            
            # Save text
            self.file_manager.save_chart_text(self.current_folder, chart_type, chart_text)
            
            # Generate and save image
            try:
                pixmap = self.image_renderer.render_chart_simple(chart_data)
                self.file_manager.save_chart_image(self.current_folder, chart_type, pixmap)
            except Exception as e:
                print(f"Warning: Could not generate image for {chart_type}: {e}")
            
            # Track generated chart
            self.generated_charts.append({
                'type': chart_type,
                'name': chart_data['chart_name'],
                'signification': chart_data['signification']
            })
            
        except Exception as e:
            print(f"Error saving chart {chart_type}: {e}")
    
    def on_generation_finished(self, success: bool, message: str):
        """Handle generation completion"""
        # Stop worker thread
        if self.worker_thread:
            self.worker_thread.quit()
            self.worker_thread.wait()
        
        # Reset UI state
        self.window.set_generating_state(False)
        
        if success:
            # Create summary file
            try:
                user_name = self.window.name_input.text()
                summary_data = {
                    'name': user_name,
                    'date': self.window.dob_input.date().toString("yyyy-MM-dd"),
                    'time': self.window.tob_input.time().toString("HH:mm:ss"),
                    'place': self.window.place_input.text(),
                    'generated_at': self.file_manager._get_timestamp(),
                    'kundli_generated': self.kundli_generated,
                    'kundli_filename': f"{user_name}_Kundli" if self.kundli_generated else None,
                    'charts': self.generated_charts
                }
                self.file_manager.create_summary_file(self.current_folder, summary_data)
            except Exception as e:
                print(f"Warning: Could not create summary: {e}")
            
            # Show success message
            self.window.update_progress(100, f"Complete! Generated {len(self.generated_charts)} charts")
            self.window.show_success(self.current_folder)
            
            # Reset progress
            self.window.update_progress(0, "Ready to generate charts")
        else:
            self.window.show_error(message)
            self.window.update_progress(0, "Generation failed")
    
    def on_error(self, error_message: str):
        """Handle errors during generation"""
        print(f"Error: {error_message}")
    
    def run(self):
        """Run the application"""
        self.window.show()
        return self.app.exec()


def main():
    """Main entry point"""
    try:
        app = AstroAIApplication()
        sys.exit(app.run())
    except Exception as e:
        print(f"Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
