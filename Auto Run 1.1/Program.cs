using System;
using System.Windows.Forms;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;

namespace Auto_Run_1._1
{
    static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.SetHighDpiMode(HighDpiMode.SystemAware);
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Form1());
            Process p = Process.GetCurrentProcess();
            RenameProcess(p);
        }


        [DllImport("user32.dll")]
        static extern int SetWindowText(IntPtr hWnd, string text);

        private static void RenameProcess(Process p)
        {
            Thread.Sleep(100);  // <-- ugly hack
            SetWindowText(p.MainWindowHandle, "My Notepad");
        }

    }

}
