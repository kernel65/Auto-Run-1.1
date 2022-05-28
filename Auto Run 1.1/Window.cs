using System;
using System.Diagnostics;
using System.Runtime.InteropServices;


namespace Auto_Run_1._1
{
    internal class Window
    {
        public static String ProgramName = "New World";
        public static int WindowWidth = 1280;
        public static int WindowHeight = 1024;

        [DllImport("user32.dll")]
        static extern bool SetForegroundWindow(IntPtr hwnd);

        [DllImport("user32.dll")]
        static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        public void ForceForegrounWindow(IntPtr hwnd)
        {
            const int SW_RESTORE = 9;

            ShowWindow(hwnd, SW_RESTORE);
            SetForegroundWindow(hwnd);
        }

        public IntPtr GetWindowHandle(String wName)
        {
            IntPtr hwnd = IntPtr.Zero;

            foreach (Process proc in Process.GetProcesses())
            {
                if (proc.MainWindowTitle.Contains(wName))
                {
                    hwnd = proc.MainWindowHandle;
                }
            }
            return hwnd;
        }
    }
}
