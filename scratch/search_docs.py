import os
import glob

def search_files():
    print("Searching Desktop...")
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    if os.path.exists(desktop):
        print(f"Desktop path: {desktop}")
        files = glob.glob(os.path.join(desktop, "*SGN*"))
        for f in files:
            print(f"Found on Desktop: {f}")
        
        pdf_files = glob.glob(os.path.join(desktop, "*.pdf"))
        for f in pdf_files:
            print(f"PDF on Desktop: {f}")
            
        docx_files = glob.glob(os.path.join(desktop, "*.docx"))
        for f in docx_files:
            print(f"DOCX on Desktop: {f}")
    else:
        print("Desktop not found.")
        
    print("\nSearching Workspace Parent...")
    parent = "D:\\I-Ai\\App\\Syrian community in the Netherlands"
    if os.path.exists(parent):
        files = glob.glob(os.path.join(parent, "*"))
        for f in files:
            if os.path.isfile(f):
                print(f"Parent file: {f}")
            elif os.path.isdir(f):
                print(f"Parent dir: {f}")
    else:
        print("Parent dir not found.")

if __name__ == "__main__":
    search_files()
