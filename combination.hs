combination :: [Int] -> Int -> [[Int]]
combination xs 0 = [[]]
combination [] n = []
combination (x:xs) n = map (x:) (combination xs (n-1)) ++ combination xs (n)
