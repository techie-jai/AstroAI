import os
import sys
path_root = os.path.dirname(os.path.abspath('../'))
if path_root not in sys.path:
    sys.path.append(str(path_root))
    print('hora',path_root,'added to system path',sys.path)

# Import utils to make it available when importing from jhora
try:
    from . import utils
except ImportError:
    try:
        import utils
    except ImportError:
        pass