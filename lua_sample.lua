-- Replace your pastebin-based login with this example.
-- Change SERVER_URL to your hosted server (e.g. https://yourdomain.com)
local SERVER_URL = "http://YOUR_SERVER:3000"  -- <- update this
function login1_local(usernameText, passwordText, keyText)
  Http.post(SERVER_URL.."/api/login", { username = usernameText, password = passwordText, key = keyText }, "json", function(code, content)
    if code == 200 then
      if content.ok then
        print("CORRECT")
        -- proceed to app
      else
        print("WRONG or error:", content.msg or content.error)
      end
    else
      print("HTTP error", code)
    end
  end)
end
-- Example usage:
-- login1_local("admin","adminpass","EXAMPLE-KEY-123")
