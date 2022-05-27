using System;

namespace Auto_Run_1._1
{
    class Navigation
    {

        public static double GetAngle(Vector2 v)
        {
            double RADTODEG = 180.0 / Math.PI;
            double angle = Math.Round(Math.Atan2(v.Y, v.X) * RADTODEG, 0);
            return angle = angle < 0 ? 180 + (180 + angle) : angle;
        }

        public static double GetAngleToTarget(Vector2 player, Vector2 target, double rotation)
        {
            //Вычисляем направляющий вектор
            Vector2 DirV = target - player;

            //Вычисляем длину
            double length = Vector2.GetLenght(DirV);

            //Нормализуем вектор
            Vector2 normal = new Vector2(DirV.X / length, DirV.Y / length);

            return GetAngle(normal);

        }

        public static double AngleDifference(double angle1, double angle2)
        {
            double diff = (angle2 - angle1 + 180) % 360 - 180;
            return diff < -180 ? diff + 360 : diff;
        }
    }
}
