using System;
using System.Runtime.InteropServices;
using WindowsInput.Native;
using WindowsInput;

namespace Auto_Run_1._1
{
    class CommandControl
    {

        public static VirtualKeyCode Move = VirtualKeyCode.NUMPAD7;
        public static VirtualKeyCode Farm = VirtualKeyCode.VK_E;
        public static VirtualKeyCode SlowMove = VirtualKeyCode.NUMPAD0;
        public static VirtualKeyCode MoveRight = VirtualKeyCode.VK_D;
        public static VirtualKeyCode MoveLeft = VirtualKeyCode.VK_A;
        public static VirtualKeyCode Jump = VirtualKeyCode.SPACE;
        public static VirtualKeyCode Tab = VirtualKeyCode.TAB;
        public static VirtualKeyCode R = VirtualKeyCode.VK_R;
        public static VirtualKeyCode E = VirtualKeyCode.VK_E;
        public static VirtualKeyCode W = VirtualKeyCode.VK_W;
        public static VirtualKeyCode B_3 = VirtualKeyCode.VK_3;
        public static VirtualKeyCode Back = VirtualKeyCode.VK_S;
       


        [DllImport("User32.Dll")]
        private static extern long SetCursorPos(int x, int y);


        public static void PressKeyUp(VirtualKeyCode code)
        {
            InputSimulator sim = new InputSimulator();
            sim.Keyboard.KeyUp(code);
        }

        public static void PressKeyDown(VirtualKeyCode code)
        {
            InputSimulator sim = new InputSimulator();
            sim.Keyboard.KeyDown(code);
        }

        public static void PressKey(VirtualKeyCode code)
        {
            InputSimulator sim = new InputSimulator();
            sim.Keyboard.KeyPress(code);
        }

        public static void PressKeyMouse()
        {
            InputSimulator sim = new InputSimulator();
            sim.Mouse.LeftButtonClick();
        }

        public static void MoveMouse(int step)
        {
            [DllImport("user32.dll")]
            static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData,
             UIntPtr dwExtraInfo);

            try
            {
                mouse_event(0x0001, step, 0, 0, UIntPtr.Zero);
            }
            catch(Exception e)
            {
                Console.WriteLine("Exception in CommandControl -> MoveMouse()");
            } 
            
        }

        public static void SetCursor(int x, int y)
        {
            SetCursorPos(x, y);
        }
    }
}
