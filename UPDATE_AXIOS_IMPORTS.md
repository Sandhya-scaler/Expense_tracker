# Update Axios Imports

The following files need to be updated to use the new axios configuration:

## Files to Update

Replace:
```javascript
import axios from 'axios';
```

With:
```javascript
import axios from '../config/axios';
```

### List of files that use axios:

1. ✅ `frontend/src/context/AuthContext.jsx` - **ALREADY UPDATED**
2. `frontend/src/pages/Dashboard.jsx`
3. `frontend/src/pages/Expenses.jsx`
4. `frontend/src/pages/Budgets.jsx`
5. `frontend/src/pages/Analytics.jsx`
6. `frontend/src/pages/Profile.jsx` (if it exists)

## Why This Change?

The new `axios.js` configuration:
- ✅ Uses environment variable for API URL
- ✅ Automatically adds auth token to requests
- ✅ Handles 401 errors globally
- ✅ Works with both development and production

## Manual Update Steps

For each file listed above:

1. Open the file
2. Find: `import axios from 'axios';`
3. Replace with: `import axios from '../config/axios';`
4. Save the file

## Verify Path Depth

Make sure the path matches the file location:
- Pages in `src/pages/`: `../config/axios`
- Components in `src/components/`: `../config/axios`
- Files in subdirectories: adjust `../` as needed

---

**Note**: The app will still work locally without these changes (due to Vite proxy), but these changes are **required for production deployment**.

