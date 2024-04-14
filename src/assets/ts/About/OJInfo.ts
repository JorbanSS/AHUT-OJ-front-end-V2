const MD_OJInfo = `
## 返回结果说明

试题的解答提交后由评分系统给出得分，每一次提交的判决结果会及时通知，系统可能的反馈信息包括：

| Result  | 中文         | Information                                                  |
| ------- | ------------ | ------------------------------------------------------------ |
| PENDING | 等待判题     | 系统忙，你的答案在排队等待                                   |
| JUDGING | 正在判题     | 正在运行和判断                                               |
| CE      | 编译错误     | 编译错误，请点击“编译错误”后获得编译器的详细输出             |
| AC      | 通过         | 程序通过                                                     |
| PE      | 输出格式错误 | 答案基本正确，但是格式不对                                   |
| WA      | 解答错误     | 答案不对，仅仅通过样例数据的测试并不一定是正确答案，一定还有你没想到的地方 |
| TLE     | 运行超时     | 运行超出时间限制，检查下是否有死循环，或者应该有更快的计算方法 |
| MLE     | 内存超限     | 超出内存限制，数据可能需要压缩，检查内存是否有泄露           |
| RE      | 运行出错     | 运行时错误，非法的内存访问，数组越界，指针漂移，调用禁用的系统函数。请点击后获得详细输出 |
| OLE     | 输出超限     | 输出超过限制，你的输出比正确答案长了很多                     |

## 程序样例
以下样例程序可用于解决这道简单的题目：读入2个整数A和B，然后输出它们的和。
\`\`\`c
// gcc (.c)

#include <stdio.h>
int main(){
    int a, b;
    while(scanf("%d %d",&a, &b) != EOF){
        printf("%d\n", a + b);
    }
    return 0;
}
\`\`\`
\`\`\`c++
// g++ (.cpp)

#include <iostream>
using namespace std;
int main(){
    int a, b;
    while (cin >> a >> b){
        cout << a+b << endl;
    }
    return 0;
}
\`\`\`
\`\`\`java
// javac (.java)

import java.util.Scanner;	
public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        while (in.hasNextInt()) {
            int a = in.nextInt();
            int b = in.nextInt();
            System.out.println(a + b);
        }
    }
}
\`\`\`
\`\`\`py
// python3 (.py)

import io
import sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='utf8')
for line in sys.stdin:
    a = line.split()
    print(int(a[0]) + int(a[1]))
    \`\`\`

`;

export default MD_OJInfo;