using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;

namespace Auto_Run_1._1
{
    internal class GrabImage
    {
        Window window = new Window();

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

        [StructLayout(LayoutKind.Sequential)]
        public struct RECT
        {
            public RECT(int xTop, int yTop, int xBottom, int yBottom)
            {
                Left = xTop;
                Top = yTop;
                Right = xBottom;
                Bottom = yBottom;
            }


            public int Left;        // x position of upper-left corner
            public int Top;         // y position of upper-left corner
            public int Right;       // x position of lower-right corner
            public int Bottom;      // y position of lower-right corner

            public override string ToString()
            {
                return string.Format("{0,4} {1,4} {2,4} {3,4}", Left, Top, Right, Bottom);
            }
        }


        public RECT GetWinCoordinates(String programName)
        {
            RECT rct;
            IntPtr handle = window.GetWindowHandle(programName);

            if (!GetWindowRect(handle, out rct))
            {
                throw new Exception("ERROR! CAN'T FIND HANDLE OF " + programName);
            }

            return rct;
        }

        public void MakeScreenShot(String path, RECT rect, int width, int height)
        {
            try
            {
                using Bitmap bmp = new Bitmap(width, height, PixelFormat.Format32bppRgb);

                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.CopyFromScreen(rect.Left + 9, rect.Top + 30, 0, 0, new System.Drawing.Size(width, height), CopyPixelOperation.SourceCopy);
                }

                bmp.Save(path);
                bmp.Dispose();
            }
            catch(Exception e)
            {
                Console.WriteLine("Exception in MakeScreenShot");
            }
        }
        

        
    }
}
